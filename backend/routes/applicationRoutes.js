import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Application from "../models/Application.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer config with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true); // ✅ allow file
    } else {
      cb(new Error("Only PDF or DOC/DOCX files are allowed"), false); // ❌ reject file
    }
  },
});

/**
 * @route POST /applications/:jobId
 * @desc Apply for a job (with resume upload)
 */
router.post("/:jobId", upload.single("resume"), async (req, res) => {
  try {
    console.log("📥 req.body =", req.body); // Debug
    console.log("📎 req.file =", req.file); // Debug

    const { name, email } = req.body;
    const { jobId } = req.params;

    // Safety checks
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Prevent duplicate applications (same email for same job)
    const existing = await Application.findOne({ jobId, email });
    if (existing) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job with this email." });
    }

    const application = new Application({
      jobId,
      name,
      email,
      resume: req.file.path, // store file path
    });

    await application.save();
    res.status(201).json({ message: "Application submitted!", application });
  } catch (err) {
    console.error("❌ Error in POST /applications:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route GET /applications/download/:applicationId
 * @desc Download resume file for an application
 */
router.get("/download/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const filePath = application.resume;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error("❌ Error downloading file:", err.message);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  } catch (err) {
    console.error("❌ Error in GET /applications/download:", err.message);
    res.status(500).json({ error: err.message });
  }
});


export default router;
