import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://chatify-api.up.railway.app/csrf", {
      method: "PATCH",
      credentials: "include",
      Accept: "application/json",
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
        credentials: "include",
        body: JSON.stringify({ ...form, csrfToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/chat");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-full flex items-center flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        <div className="sm:mx-auto text-center sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Logga in
          </h2>
          <p className="text-sm text-gray-500">Välkommen tillbaka!</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Användarnamn
          </label>
          <input
            name="username"
            placeholder="t.ex. johndoe"
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
            placeholder="••••••••"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer transition"
        >
          Logga in
        </button>

        <p className="text-center text-sm text-gray-500">
          Har du inget konto?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Registrera dig
          </a>
        </p>

        <p className="text-center text-sm text-gray-500">
          Har du glömt ditt lösenord?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Byt lösenord
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
