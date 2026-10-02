import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

const router = express.Router();

// POST /api/upload-image
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const filename = req.file.filename;
    const previewUrl = `/uploads/${filename}`;

    // Intelligent heuristic match based on original filename if relevant
    const origName = (req.file.originalname || "").toLowerCase();
    let suggestedQuery = "";
    let suggestedCategory = "";

    if (origName.includes("iphone") || origName.includes("apple")) {
      suggestedQuery = "Apple iPhone";
      suggestedCategory = "Mobiles";
    } else if (origName.includes("samsung") || origName.includes("galaxy")) {
      suggestedQuery = "Samsung Galaxy";
      suggestedCategory = "Mobiles";
    } else if (origName.includes("macbook") || origName.includes("laptop")) {
      suggestedQuery = "MacBook";
      suggestedCategory = "Laptops";
    } else if (origName.includes("headphone") || origName.includes("sony") || origName.includes("airpod")) {
      suggestedQuery = "Headphones";
      suggestedCategory = "Headphones";
    } else if (origName.includes("tv") || origName.includes("oled") || origName.includes("bravia")) {
      suggestedQuery = "OLED TV";
      suggestedCategory = "TVs";
    } else if (origName.includes("watch")) {
      suggestedQuery = "Watch";
      suggestedCategory = "Smart Watches";
    }

    return res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        previewUrl,
        suggestedQuery,
        suggestedCategory
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Image upload failed: " + error.message });
  }
});

export default router;
