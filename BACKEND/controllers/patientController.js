const PatientRecord = require("../models/patientRecordModel"); // ✅ Fixed import


exports.createPatient = async (req, res) => {
    try {
        // Multer/FormData: If using multer for file uploads, data might be in req.body
        // If file uploaded, you must handle documentPath accordingly (not shown here).
        const { email, patientName, age, doctorId } = req.body;

        if (!email || !patientName || !age || !doctorId) {
            return res.status(400).json({ message: "Required fields missing." });
        }

        // Check if patient exists by email
        let patient = await PatientRecord.findOne({ email });

        if (patient) {
            // Update existing patient record
            patient.patientName = patientName;
            patient.age = age;
            patient.doctorId = doctorId;
            // update other fields if necessary...

            // documentPath handling (if file uploaded and saved separately)
            if (req.file) {
                patient.documentPath = req.file.path; // Assuming middleware saves file and attaches it as req.file
            }
            
            const updatedPatient = await patient.save();
            return res.status(200).json(updatedPatient);
        } else {
            // Create new patient record
            let newPatientData = { ...req.body };

            if (req.file) {
                newPatientData.documentPath = req.file.path;
            }
            
            const newPatient = new PatientRecord(newPatientData);
            const savedPatient = await newPatient.save();
            return res.status(201).json(savedPatient);
        }
    } catch (error) {
        console.error("Patient creation error:", error);
        return res.status(400).json({ message: error.message });
    }
};

// Add your GET methods etc. as needed


// GET all patients
exports.getPatients = async (req, res) => {
    try {
        const patients = await PatientRecord.find().populate('doctorId');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
