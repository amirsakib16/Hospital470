const mongoose = require("mongoose");
// Define schema
const feedbackSchema = new mongoose.Schema({
    patientId: String,
    doctorId: String,
    feedback: String,
    submittedAt: { type: Date, default: Date.now },
}, { collection: "FeedBack" });

// Create model
module.exports = mongoose.model("DoctorsFeedback", feedbackSchema);
