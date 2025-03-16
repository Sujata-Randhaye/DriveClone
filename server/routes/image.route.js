import express from "express";
import upload from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadImage, getUserImages } from "../controllers/image.controller.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("image"), uploadImage);
router.get("/", verifyJWT, getUserImages);

export default router;
