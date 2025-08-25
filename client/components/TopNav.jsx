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
        <div className="flex items-center justify-between px-6 py-2 bg-gray-100 shadow-lg w-full">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-medium text-gray-700">
            Välkommen {user.user || "gäst"}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 cursor-pointer rounded hover:bg-red-600"
          >
            Logga ut
          </button>
        </div>
      )}
    </>
  );
};

export default TopNav;
