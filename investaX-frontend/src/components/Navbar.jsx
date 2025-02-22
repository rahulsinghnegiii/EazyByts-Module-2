import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <h1 className="text-xl font-bold">Stock Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
