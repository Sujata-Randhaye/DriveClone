import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Change this to your backend URL
  withCredentials: true, // Needed to send cookies with requests
  headers: { "Content-Type": "application/json" }
});

// Register User
export const registerUser = async (userData) => {
  return await API.post("/auth/register", userData);
};

// Login User
export const loginUser = async (userData) => {
  return await API.post("/auth/login", userData);
};

// Logout User
export const logoutUser = async () => {
  return await API.post("/auth/logout");
};

//Get folders
export const getFolders=async()=>{
    return await API.get("/folders");
}

// create folder
export const createFolder = async (folderData) => {
    return await API.post("/folders", folderData);
};

