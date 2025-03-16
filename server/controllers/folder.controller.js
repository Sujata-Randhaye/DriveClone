import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Folder } from "../models/folder.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Auth middleware

const router = express.Router();

// Create a folder
const createFolder=asyncHandler(async (req, res) => {
    const { name, parentFolder } = req.body;
    
    if (!name.trim()) {
        throw new ApiError(400, "Folder name is required");
    }

    const folder = await Folder.create({
        name,
        parentFolder: parentFolder || null, // Allows nested folders
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(201, folder, "Folder created successfully"));
});

// Get folders (Only user-specific)
const getFolder=asyncHandler(async (req, res) => {
    const folders = await Folder.find({ createdBy: req.user._id });
    res.json(new ApiResponse(200, folders, "User folders fetched successfully"));
});

export {createFolder,getFolder}
