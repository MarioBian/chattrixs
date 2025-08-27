import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    avatar: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
      Accept: "application/json",
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setError("Kunde inte hämta CSRF🥲"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, password, email, avatar } = form;

    try {
      const res = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            avatar,
            csrfToken,
          }),
        }
      );
      const data = await res.json();

      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Registrera konto
          </h2>
          <p className="text-sm text-gray-200 mt-1">
            Skapa ett nytt användarkonto
          </p>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center font-medium">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 text-sm text-center font-medium">
            {success}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Användarnamn
            </label>
            <input
              name="username"
              placeholder="Användarnamn"
              className="block w-full rounded-xl bg-white/20 px-4 py-2 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              E-postadress
            </label>
            <input
              name="email"
              type="email"
              placeholder="exempel@gmail.com"
              className="block w-full rounded-xl bg-white/20 px-4 py-2 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Lösenord
            </label>
            <input
              name="password"
              type="password"
              placeholder="Minst 6 tecken"
              className="block w-full rounded-xl bg-white/20 px-4 py-2 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Avatar URL (valfritt)
            </label>
            <input
              name="avatar"
              placeholder="https://i.pravatar.cc/200"
              className="block w-full rounded-xl bg-white/20 px-4 py-2 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg"
        >
          Skapa konto
        </button>

        <p className="text-center text-sm text-gray-300 mt-4">
          Har du redan ett konto?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:text-white underline"
          >
            Logga in här
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
