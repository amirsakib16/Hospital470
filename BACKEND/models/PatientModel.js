const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  // add other fields as needed
},
{collection: "Patient"});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
