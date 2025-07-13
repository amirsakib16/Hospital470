const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Doctor = require("../models/doctorModel");

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage });

// POST route
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const newDoctor = new Doctor({
            doctorName: req.body.doctorName,
            department: req.body.department,
            hospital: req.body.hospital,
            degree: req.body.degree,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            id: req.body.id,
            imagePath: req.file ? req.file.filename : null,
        });

        const saved = await newDoctor.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
