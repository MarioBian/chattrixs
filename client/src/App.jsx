import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Chat from "../components/Chat";
import ChangePassword from "../components/ChangePassword";
import TopNav from "../components/TopNav";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/chat"
              element={
                <div className="chat-bg flex justify-center items-start min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6">
                  <div className="flex flex-col max-w-md w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                    <TopNav user={user} setUser={setUser} />
                    <Chat user={user} />
                  </div>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/chat" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
