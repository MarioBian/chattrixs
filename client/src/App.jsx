import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import SideNav from "../components/SideNav";
import Chat from "../components/Chat";
import ChangePassword from "../components/ChangePassword";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
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
                  <SideNav />
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
