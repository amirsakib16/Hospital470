const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorName: String,
    department: String,
    hospital: String,
    degree: String,
    phoneNumber: String,
    email: String,
    id: String,
    imagePath: String, // store uploaded image filename or path
}, { collection: "DoctorInformation" });

module.exports = mongoose.model("Doctor", doctorSchema);
