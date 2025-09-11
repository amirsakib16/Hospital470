const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    patientEmail: {
        type: String,
        required: true,   // ✅ email is required now
        lowercase: true,
        trim: true
    },
    doctorId: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    submittedAt: { type: Date, default: Date.now }
}, { collection: "FeedBack" });

module.exports = mongoose.model("DoctorsFeedback", feedbackSchema);
