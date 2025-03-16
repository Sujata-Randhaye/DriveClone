import express from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createFolder,getFolder } from "../controllers/folder.controller.js"

const router=express.Router()

router.post('/',verifyJWT,createFolder)
router.get('/',verifyJWT,getFolder)

export default router