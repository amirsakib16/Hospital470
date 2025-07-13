const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    documentPath: {
        type: String,
        required: false  // ✅ Fixed: Make optional
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
}, { 
    collection: "PatientInformation",
    timestamps: true  // ✅ Added: Automatic createdAt/updatedAt
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
