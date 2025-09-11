const mongoose = require("mongoose");

const HospitalCaseSchema = new mongoose.Schema({
    email: String,
    emergency: Boolean,
    patientName: String,
    hospitalName: String
}, { collection: "HospitalCase" });

module.exports = mongoose.model("HospitalCase", HospitalCaseSchema);
