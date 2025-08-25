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
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            avatar,
          }),
        }
      );
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Server returned invalid JSON" };
      }

      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error || "registration failed");

      setSuccess("Du är nu registrerad 👊");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Registrera konto</h2>
          <p className="text-sm text-gray-500">Skapa ett nytt användarkonto</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm text-center">{success}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Användarnamn
          </label>
          <input
            name="username"
            placeholder="Användarnamn"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            E-postadress
          </label>
          <input
            name="email"
            type="email"
            placeholder="exempel@gmail.com"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Lösenord
          </label>
          <input
            name="password"
            type="password"
            placeholder="Minst 6 tecken"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Avatar URL (valfritt)
          </label>
          <input
            name="avatar"
            placeholder="https://i.pravatar.cc/200"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer transition"
        >
          Skapa konto
        </button>

        <p className="text-center text-sm text-gray-500">
          Har du redan ett konto?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Logga in här
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
