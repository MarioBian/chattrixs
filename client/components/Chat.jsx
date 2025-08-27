import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";

const Chat = ({ user }) => {
  const [fakeMessages] = useState([
    {
      text: "Halloj hur mår du?",
      avatar: "https://i.pravatar.cc/100?",
      username: "Marre",
      conversationId: null,
      id: "fake_id_1",
    },
    {
      text: "Hoppas det går bra med plugget",
      avatar: "https://i.pravatar.cc/100?",
      username: "Marre",
      conversationId: null,
      id: "fake_id_2",
    },
    {
      text: "Vi skulle ju åka hoj, men lycka till med studierna 😃",
      avatar: "https://i.pravatar.cc/100?",
      username: "Marre",
      conversationId: null,
      id: "fake_id_3",
    },
  ]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const fetchMessages = async () => {
    if (!user?.token) {
      console.warn("Ingen token, kan inte hämta meddelande");
      return;
    }
    try {
      const res = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Misslyckades hämta meddelanden");
      }

      const data = await res.json();
      const myMessages = data.map((msg) => ({
        ...msg,
        username: "Du",
      }));
      setMessages(myMessages);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fakeIndex = useRef(0);
  useEffect(() => {
    const sortedFakeMessages = [...fakeMessages].sort(
      (a, b) => parseInt(a.id.split("_")[2]) - parseInt(b.id.split("_")[2])
    );

    const interval = setInterval(() => {
      const i = fakeIndex.current;

      if (i >= sortedFakeMessages.length) {
        clearInterval(interval);
        return;
      }

      setMessages((prev) => [...prev, sortedFakeMessages[i]]);
      fakeIndex.current += 1;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    console.log("Skicka meddelande:", input);
    const clean = DOMPurify.sanitize(input);
    if (!clean.trim()) return;

    setInput("");

    try {
      const res = await fetch("https://chatify-api.up.railway.app/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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
      setMessages((prev) => [
        ...prev.map((msg) =>
          typeof msg.id === "number" ? { ...msg, username: "Du" } : msg
        ),
        ...(typeof newMsg.latestMessage.id === "number"
          ? [{ ...newMsg.latestMessage, username: "Du" }]
          : [newMsg.latestMessage]),
      ]);
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
            Authorization: `Bearer ${user.token}`,
          },
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-4">
      <div className="flex flex-col h-full max-h-[700px] w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-lg flex flex-col${
                msg.username === "Du"
                  ? "bg-blue-600 text-white rounded-br-none ml-auto"
                  : "bg-gray-200 text-gray-800 rounded-bl-none mr-auto"
              }`}
            >
              {msg.avatar && (
                <img
                  src={msg.avatar}
                  alt={msg.username}
                  className="w-8 h-8 rounded-full mr-2 shadow"
                />
              )}
              <p className="text-sm text-white">
                <strong>{msg.username}:</strong> {msg.text}
              </p>
              <p className="text-sm">
                {msg.username === "Du" && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-xs text-red-300 hover:text-red-500 mt-1 ml-3  self-start cursor-pointer"
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
          className="p-4 border-t border-white/20 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Skriv ett meddelande..."
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition cursor-pinter"
          >
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
