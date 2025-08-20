require("dotenv").config();
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "fallbackSecret123";

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

const isProd = process.env.NODE_ENV === "production";

app.use(cookieParser());

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax", // "none" för produktion (cross-site)
      secure: isProd, // true i produktion, false lokalt
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.json());

//  Helpers
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Middleware för auth
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

//  Register
app.post("/auth/register", async (req, res) => {
  const { username, password, email, avatar } = req.body;
  const users = readJson("users.json");

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username or email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    username,
    email,
    password: hashed,
    avatar: avatar || `https://i.pravatar.cc/150?u=${username}`,
  };

  users.push(newUser);
  writeJson("users.json", users);

  res.status(201).json({ message: "Registration successful" });
});

// Login
app.post("/auth/token", (req, res) => {
  const { username, password } = req.body;
  const users = readJson("users.json");
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  bcrypt
    .compare(password, user.password)
    .then((match) => {
      if (!match) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      });
    })
    .catch(() => res.status(500).json({ error: "Server error" }));
});

//  Get messages (protected)
app.get("/messages", auth, (req, res) => {
  res.json(readJson("messages.json"));
});

// Post message (protected)
app.post("/messages", auth, (req, res) => {
  const { content } = req.body;
  const clean = content.replace(/<[^>]*>?/gm, ""); // Enkel XSS-skydd

  const messages = readJson("messages.json");
  const newMsg = {
    id: Date.now(),
    userId: req.userId,
    content: clean,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMsg);
  writeJson("messages.json", messages);
  res.status(201).json(newMsg);
});

// Delete message (protected)
app.delete("/messages/:id", auth, (req, res) => {
  const messages = readJson("messages.json");
  const id = Number(req.params.id);
  const msg = messages.find((m) => m.id === id);

  if (!msg || msg.userId !== req.userId) {
    return res.status(403).json({ error: "Not allowed" });
  }

  const updated = messages.filter((m) => m.id !== id);
  writeJson("messages.json", updated);
  res.json({ success: true });
});

// CSRF-token route
app.patch("/csrf", (req, res) => {
  const csrfToken = Math.random().toString(36).substring(2);
  if (req.session) req.session.csrfToken = csrfToken;
  res.json({ csrfToken });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Servern körs på http://localhost:${PORT}`);
});
