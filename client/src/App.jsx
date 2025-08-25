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
  //const [user, setUser] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
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
                <div className="flex justify-center items-start min-h-screen bg-gray-200 p-4">
                  <div className="flex  flex-col max-w-md w-full bg-gray-100 shadow-lg">
                    <TopNav user={user} setUser={setUser} />
                    <Chat />
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
