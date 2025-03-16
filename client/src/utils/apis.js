import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL
  withCredentials: true, // Needed to send cookies with requests
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
