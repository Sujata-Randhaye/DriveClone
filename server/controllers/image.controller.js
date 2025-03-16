import Image from "../models/image.model.js";
import path from "path";
import fs from "fs";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Image file is required" });

        const image = new Image({
            name: req.body.name,
            imageUrl: `/uploads/${req.file.filename}`,
            userId: req.user.id,
        });

        await image.save();
        res.status(201).json({ message: "Image uploaded successfully", data: image });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error });
    }
};

export const getUserImages = async (req, res) => {
    try {
        const images = await Image.find({ userId: req.user.id });
        res.status(200).json({ data: images });
    } catch (error) {
        res.status(500).json({ message: "Error fetching images", error });
    }
};
