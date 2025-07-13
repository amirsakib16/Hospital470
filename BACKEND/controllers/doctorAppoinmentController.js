const PatientRecord = require("../models/patientRecordModel");
const path = require('path');
const fs = require('fs');

// GET patients by doctor ID
exports.getPatientsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const patients = await PatientRecord.find({ doctorId })
            .populate('doctorId', 'doctorName department')
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients by doctor:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await PatientRecord.find()
            .populate('doctorId', 'doctorName department')
            .sort({ createdAt: -1 });
        
        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching all patients:', error);
        res.status(500).json({ message: error.message });
    }
};

// Download PDF file
exports.downloadPatientDocument = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const patient = await PatientRecord.findById(patientId);
        if (!patient || !patient.documentPath) {
            return res.status(404).json({ message: "Document not found" });
        }

        const filePath = path.join(__dirname, '..', 'uploads', 'documents', 
            patient.documentPath.replace('/documents/', ''));
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        const fileName = `${patient.patientName}_medical_report.pdf`;
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');
        
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error downloading document:', error);
        res.status(500).json({ message: error.message });
    }
};
