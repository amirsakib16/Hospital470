const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Doctor = require("../models/doctorModel");
const doctorController = require("../controllers/doctorController"); // ✅ Added missing import
const recommendDoctor = require("../controllers/doctorController");
const patientinfo = require('../controllers/patientController')
const PatientRecord = require("../models/patientRecordModel");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `doctor-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// ✅ ROUTES IN CORRECT ORDER (specific routes before general routes)

// GET doctor statistics (must be before /:id route)
router.get('/stats', doctorController.getDoctorStats);

// GET doctors by department (must be before /:id route)
router.get('/department/:department', doctorController.getDoctorsByDepartment);

// POST route - Create doctor with image upload
router.post("/", upload.single("image"), async (req, res) => {
    try {
        console.log('Creating doctor with data:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate required fields
        const { doctorName, department, hospital, degree, phoneNumber, email } = req.body;

        if (!doctorName || !department || !hospital || !degree || !phoneNumber || !email) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const newDoctor = new Doctor({
            doctorName,
            department,
            hospital,
            degree,
            phoneNumber,
            email,
            id: req.body.id || null,
            imagePath: req.file ? req.file.filename : null,
        });

        const savedDoctor = await newDoctor.save();
        console.log('Doctor saved successfully:', savedDoctor);

        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: savedDoctor
        });
    } catch (err) {
        console.error('Error saving doctor:', err);
        res.status(500).json({
            success: false,
            message: "Failed to create doctor",
            error: err.message
        });
    }
});

// ✅ REMOVED DUPLICATE - Using controller method instead
// GET all doctors
router.get("/", doctorController.getAllDoctors);

// GET doctor by ID (must be last to avoid conflicts)
router.get("/:id", doctorController.getDoctorById);


router.post("/recommend", doctorController.recommendDoctor);

// GET doctor by email - add this route
router.get('/email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const doctor = await Doctor.findOne({ email: email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// GET patients/appointments by doctor's email
// GET patients/appointments by doctor's email
router.get('/doctor-email/:email', async (req, res) => {
    try {
        const doctorEmail = req.params.email;

        // Find the doctor by email first
        const doctor = await Doctor.findOne({ email: doctorEmail });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Find patients linked to doctor._id
        const patients = await PatientRecord.find({ doctorId: doctor._id });

        return res.json({ success: true, data: patients });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});



router.post("/doctorlog", doctorController.doctorLogin);

module.exports = router;


module.exports = router;
