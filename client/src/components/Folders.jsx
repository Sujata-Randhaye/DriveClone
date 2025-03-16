import { useEffect, useState } from "react";
import axios from "axios";

const Folders = ({ folders: initialFolders }) => {
    const [folders, setFolders] = useState(initialFolders || []);
    const [openFolders, setOpenFolders] = useState({});

    useEffect(() => {
        if (!initialFolders) {
            const fetchFolders = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/api/folders", {
                        withCredentials: true,
                    });
                    setFolders(response.data.data);
                } catch (error) {
                    console.error("Error fetching folders:", error);
                }
            };

            fetchFolders();
        }
    }, [initialFolders]);

    const toggleFolder = (folderId) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folderId]: !prev[folderId],
        }));
    };

    const renderFolders = (folderList, parentId = null) => {
        return folderList
            .filter(folder => folder.parentFolder === parentId)
            .map(folder => (
                <div key={folder._id} className="ml-4 mt-2">
                    <div 
                        className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md transition duration-300"
                        onClick={() => toggleFolder(folder._id)}
                    >
                        <span className="text-lg">{openFolders[folder._id] ? "📂" : "📁"}</span>
                        <span className="ml-2 font-semibold">{folder.name}</span>
                    </div>

                    {openFolders[folder._id] && (
                        <div className="ml-6 border-l-2 border-gray-400 pl-4">
                            {renderFolders(folderList, folder._id)}
                        </div>
                    )}
                </div>
            ));
    };

    return (
        <div className="mt-6 bg-white p-4 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">Your Folders</h3>
            <div className="mt-2">{renderFolders(folders)}</div>
        </div>
    );
};

export default Folders;
