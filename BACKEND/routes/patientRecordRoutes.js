const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PatientRecord = require("../models/patientRecordModel");

// Configure Multer for PDF Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "..", "uploads", "documents");
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const safeFilename = file.originalname.replace(/\s+/g, "_");
        cb(null, `${timestamp}_${safeFilename}`);
    }
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 50 * 1024 * 1024, // Increased to 50 MB
        fieldSize: 50 * 1024 * 1024  // Also increase field size
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"));
        }
    }
});


// POST /api/patientrecords/
router.post("/", upload.single("document"), async (req, res) => {
    try {
        const { patientName, age, doctorId } = req.body;

        // ✅ Enhanced validation
        if (!patientName || !age || !doctorId) {
            return res.status(400).json({ message: "Patient name, age, and doctor selection are required." });
        }

        // ✅ Validate age range
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
            return res.status(400).json({ message: "Age must be between 0 and 150." });
        }

        // ✅ Require document upload
        if (!req.file) {
            return res.status(400).json({ message: "Document upload is required." });
        }

        // Create new record
        const newPatientRecord = new PatientRecord({
            patientName: patientName.trim(),
            age: ageNum,
            doctorId,
            documentPath: `/documents/${req.file.filename}`
        });

        const savedRecord = await newPatientRecord.save();
        res.status(201).json(savedRecord);

    } catch (err) {
        console.error("Upload Error:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Added GET route
router.get("/", async (req, res) => {
    try {
        const records = await PatientRecord.find().populate('doctorId');
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
