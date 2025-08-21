import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      text: "Halloj hur mår du?",
      avatar: "https://i.pravatar.cc/100?",
      username: "Johnny",
      conversationId: null,
    },
    {
      text: "Hoppas det går bra med plugget",
      avatar: "https://i.pravatar.cc/100?",
      username: "Johnny",
      conversationId: null,
    },
    {
      text: "Vi skulle ju åka hoj, men lycka till med studierna 😃",
      avatar: "https://i.pravatar.cc/100?",
      username: "Johnny",
      conversationId: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const storedUser = localStorage.getItem("user");
  let user = null;

  if (storedUser && storedUser !== "undefined") {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Kunde inte parsa user från localStorage", error);
    }
  }

  const fetchMessages = async () => {
    if (!user?.token) {
      console.warn("Ingen token, kan inte hämta meddelande");
      return;
    }
    try {
      const res = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: user ? `Bearer ${user.token}` : "",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Misslyckades hämta meddelanden");
      }

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    console.log("Skicka meddelande:", input);
    const clean = DOMPurify.sanitize(input);
    if (!clean.trim()) return;

    const newMsg = {
      text: clean,
      username: "Du",
      id: Date.now(),
      conversationId: null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessages((prev) => [...prev, messages[randomIndex]]);
    }, 5000);

    try {
      const res = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user ? `Bearer ${user.token}` : "",
        },
        credentials: "include",
        body: JSON.stringify({
          text: clean,
          conversationId: currentConversationId,
        }),
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
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    if (!user?.token) return;
    try {
      const res = await fetch(
        `https://chatify-api.up.railway.app/messages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: user ? `Bearer ${user.token}` : "",
          },
          credentials: "include",
        }
      );

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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col h-full max-w-md w-full  bg-white shadow-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 ">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`max-w-sm p-3 rounded-xl shadow ${
                msg.user === "Du"
                  ? "bg-indigo-100 ml-auto text-right"
                  : "bg-white mr-auto text-left"
              }`}
            >
              {msg.avatar && (
                <img
                  src={msg.avatar}
                  alt={msg.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <p className="text-sm text-gray-800">{msg.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {msg.username}
                {msg.username === "Du" && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="ml-2 text-red-500 hover:underline cursor-pointer"
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
            className="ml-2 px-4 bg-indigo-600 text-white rounded cursor-pointer hover:bg-green-700"
          >
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
