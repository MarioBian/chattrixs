import { useState, useEffect } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3000/csrf", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setError("Kunde inte hämta CSRF-token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/auth/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          /*"X-CSRF-Token" : csrfToken,*/
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Något gick fel");

      setMessage("Lösenord ändrat!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Byt lösenord</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <input
        type="password"
        placeholder="Nuvarande lösenord"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        className="mb-2 p-2 border rounded w-full"
      />
      <input
        type="password"
        placeholder="Nytt lösenord"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="mb-4 p-2 border rounded w-full"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Byt lösenord
      </button>
    </form>
  );
};

export default ChangePassword;
