import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { addFood, listFood, removeFood, importFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Ensure 'uploads' directory exists before uploading files
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);  // Save files in 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);  // Unique filename
//     }
// });
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Save the file with its original name
    }
});


// Initialize Multer Upload
const upload = multer({ storage: storage });

// 📌 Import Menu List (From Excel/JSON)
foodRouter.post("/importmenulist", importFood);

// 📌 Upload Multiple Images
foodRouter.post("/upload-images", upload.array("images", 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const filePaths = req.files.map(file => file.filename);
    res.json({ success: true, message: "Images uploaded successfully!", files: filePaths });
});

// 📌 Add a New Food Item (With Single Image Upload)
foodRouter.post("/add", upload.single("image"), addFood);

// 📌 Get Food List
foodRouter.get("/list", listFood);

// 📌 Remove Food Item
foodRouter.post("/remove", removeFood);

export default foodRouter;
