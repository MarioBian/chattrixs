import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setError("Kunde inte hämta CSRF-token"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, csrfToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          data?.error === "Invalid credentials"
            ? "Fel användarnamn eller lösenord, vänligen försök igen ✌️"
            : data?.error ||
              "Du kunde tyvärr inte logga in, försök igen senare eller med ett annat inlogg 🥲";
        throw new Error(message);
      }

      const decoded = jwtDecode(data.token);
      const userData = { ...decoded, token: data.token };

      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
      >
        <div className="sm:mx-auto text-center sm:w-full sm:max-w-sm">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🔐 Logga in
          </h2>
          <p className="text-gray-300 text-center text-sm mt-6">
            Välkommen tillbaka!
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm text-gray-200 mb-1">
            Användarnamn
          </label>
          <input
            name="username"
            placeholder="Användarnamn"
            className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-200 mb-1">Lösenord</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition shadow-lg cursor-pointer"
        >
          Logga in
        </button>

        <p className="text-gray-300 text-center text-sm mt-6">
          Har du inget konto?{" "}
          <a
            href="/register"
            className="text-purple-300 hover:text-white underline"
          >
            Registrera dig
          </a>
        </p>

        <p className="text-gray-300 text-center text-sm mt-6">
          Har du glömt ditt lösenord?{" "}
          <a
            href="/login"
            className="text-purple-300 hover:text-white underline"
          >
            Byt lösenord
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
