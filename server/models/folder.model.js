import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null }, // Nested folder support
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User-specific access
}, { timestamps: true });

export const Folder = mongoose.model("Folder", folderSchema);
