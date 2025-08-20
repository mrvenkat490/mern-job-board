import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

// 👇 NEW: import job routes
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));


// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Resume upload route
app.post("/apply", upload.single("resume"), (req, res) => {
  res.json({ message: "Resume uploaded!", file: req.file });
});

// 👇 NEW: use job routes
app.use("/jobs", jobRoutes);

// MongoDB
const MONGO_URI = process.env.MONGO_URI || "";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    app.listen(PORT, () =>
      console.log(`🚀 Server running (no DB) on http://localhost:${PORT}`)
    );
  });
