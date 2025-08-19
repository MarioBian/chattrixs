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
import SideNav from "../components/SideNav";
import Chat from "../components/Chat";
import ChangePassword from "../components/ChangePassword";

function App() {
  //const [user, setUser] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
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
                <>
                  <SideNav user={user} setUser={setUser} />
                  <Chat />
                </>
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
