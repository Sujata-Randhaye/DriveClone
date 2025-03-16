import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                {/* Create Folder */}
                <div
                    onClick={() => navigate("/create-folder")}
                    className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition"
                >
                    <h3 className="text-xl font-semibold">📁 Create Folder</h3>
                </div>

                {/* View Folders */}
                <div
                    onClick={() => navigate("/view-folders")}
                    className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition"
                >
                    <h3 className="text-xl font-semibold">📂 View Folders</h3>
                </div>

                {/* Upload Images */}
                <div
                    onClick={() => navigate("/upload-image")}
                    className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-100 transition"
                >
                    <h3 className="text-xl font-semibold">📤 Upload Images</h3>
                </div>
            </div>
           <div className="mt-10">
           <Logout/>
           </div>
        </div>
    );
};

export default Dashboard;
