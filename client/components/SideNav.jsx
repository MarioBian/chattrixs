import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  let user = null;

  if (storedUser && storedUser !== "undefined") {
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Kunde inte parsa user från localStorage", error);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
      <div className="flex items-center space-x-3">
        <img
          src={user?.avatar || "https://i.pravatar.cc/150"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-lg font-medium text-gray-700">
          {user?.username}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logga ut
      </button>
    </div>
  );
};

export default SideNav;
