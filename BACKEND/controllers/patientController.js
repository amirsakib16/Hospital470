const PatientRecord = require("../models/patientRecordModel"); // ✅ Fixed import

// CREATE
exports.createPatient = async (req, res) => {
    try {
        // ✅ Added validation
        const { patientName, age, doctorId } = req.body;
        
        if (!patientName || !age || !doctorId) {
            return res.status(400).json({ message: "Required fields missing." });
        }

        const newPatient = new PatientRecord(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        console.error("Patient creation error:", error);
        res.status(400).json({ message: error.message });
    }
};

// GET all patients
exports.getPatients = async (req, res) => {
    try {
        const patients = await PatientRecord.find().populate('doctorId');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
