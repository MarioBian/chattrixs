import { useNavigate } from "react-router-dom";

const TopNav = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  return (
    <>
      {user && (
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md w-full ">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-white shadow"
          />
          <span className="text-lg font-semibold text-white drop-shadow">
            Välkommen {user.user || "gäst"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full text-white font-medium transition shadow-md cursor-pointer"
          >
            Logga ut
          </button>
        </div>
      )}
    </>
  );
};

export default TopNav;
