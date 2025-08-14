import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const storedUser = localStorage.getItem("user");
  let user = null;

  if (storedUser && storedUser !== "undefined") {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Kunde inte parsa user från localStorage", error);
    }
  }

  useEffect(() => {
    fetch("http://localhost:3000/csrf", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Misslyckades hämta CSRF-token");
        return res.json();
      })
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error.message));
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://localhost:3000/messages", {
        credentials: "include",
        headers: {
          Authorization: user ? `Bearer ${user.token}` : "",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Misslyckades hämta meddelanden");
      }

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error.message);
      // ev redirect till login eller visa meddelande
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const clean = DOMPurify.sanitize(input);
    if (!clean.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user ? `Bearer ${user.token}` : "",
          "csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ content: clean }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Fel vid sändning av meddelande");
      }

      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: user ? `Bearer ${user.token}` : "",
          "csrf-token": csrfToken,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Fel vid radering av meddelande");
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-sm p-3 rounded-xl shadow ${
              msg.user === user?.username
                ? "bg-indigo-100 ml-auto text-right"
                : "bg-white mr-auto text-left"
            }`}
          >
            <p className="text-sm text-gray-800">{msg.text}</p>
            <p className="text-xs text-gray-500 mt-1">
              {msg.user}
              {msg.user === user?.username && (
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="ml-2 text-red-500 hover:underline"
                >
                  Radera
                </button>
              )}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="flex p-4 bg-white border-t border-gray-300"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none"
          placeholder="Skriv ett meddelande..."
        />
        <button
          type="submit"
          className="ml-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Skicka
        </button>
      </form>
    </div>
  );
};

export default Chat;
