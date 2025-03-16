import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
import folderRoutes from "./routes/folder.route.js"
import imageRouter from './routes/image.route.js'
import path from "path";
import { fileURLToPath } from "url";  // ✅ Import for ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN|| 'http://localhost:5173',
    credentials:true,
}));

app.use(express.json({limit:"16kb"}));  //parse data is saved to req
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use("/api/auth",userRouter)
app.use("/api/folders",folderRoutes)
app.use("/api/images",imageRouter)
app.use((err, req, res, next) => {
    console.error(err); 

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
            statusCode: err.statusCode
        });
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong on the server",
        statusCode: 500
    });
});

export {app}