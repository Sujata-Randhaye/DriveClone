import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/apis.js";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default Logout;
