import { useEffect, useState } from "react";
import axios from "axios";

const CreateFolder = () => {
    const [folderName, setFolderName] = useState("");
    const [folders, setFolders] = useState([]);
    const [parentFolder, setParentFolder] = useState(""); // For nested folders
    const [loading, setLoading] = useState(false);
    const [openFolders, setOpenFolders] = useState({}); // To track which folders are expanded

    // Fetch user's folders after login
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/folders", {
                    withCredentials: true, // Ensures cookies (JWT) are sent
                });
                setFolders(response.data.data); // Assuming response has a `data` object
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };

        fetchFolders();
    }, []);

    // Handle folder creation
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!folderName.trim()) {
            alert("Folder name is required");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/folders",
                { name: folderName, parentFolder: parentFolder || null }, // Send parentFolder only if selected
                {
                    withCredentials: true, // Send authentication cookies
                    headers: { "Content-Type": "application/json" }
                }
            );

            alert(response.data.message);
            setFolderName(""); // Reset input
            setParentFolder(""); // Reset selection
            setFolders([...folders, response.data.data]); // Update UI
        } catch (error) {
            alert("Failed to create folder");
        } finally {
            setLoading(false);
        }
    };

    // Toggle folder open/close state
    const toggleFolder = (folderId) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId], // Toggle current folder state
        }));
    };

    // Recursive function to display nested folders with toggle feature
    const renderFolders = (folderList, parentId = null) => {
        return folderList
            .filter(folder => folder.parentFolder === parentId) // Get only child folders
            .map(folder => (
                <div key={folder._id} className="ml-4 mt-2">
                    <div 
                        className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md transition duration-300"
                        onClick={() => toggleFolder(folder._id)}
                    >
                        <span className="text-lg">{openFolders[folder._id] ? "📂" : "📁"}</span>
                        <span className="ml-2 font-semibold">{folder.name}</span>
                    </div>

                    {/* Show children only if folder is open */}
                    {openFolders[folder._id] && (
                        <div className="ml-6 border-l-2 border-gray-400 pl-4">
                            {renderFolders(folderList, folder._id)}
                        </div>
                    )}
                </div>
            ));
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Create a Folder</h2>
            
            <form onSubmit={handleCreateFolder} className="flex flex-col gap-4 bg-white p-4 shadow-md rounded-md">
                <input
                    type="text"
                    placeholder="Folder Name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <select
                    value={parentFolder}
                    onChange={(e) => setParentFolder(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    <option value="">No Parent (Root Folder)</option>
                    {folders.map((folder) => (
                        <option key={folder._id} value={folder._id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Folder"}
                </button>
            </form>

            <div className="mt-6 bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-semibold">Your Folders</h3>
                <div className="mt-2">{renderFolders(folders)}</div>
            </div>
        </div>
    );
};

export default CreateFolder;
