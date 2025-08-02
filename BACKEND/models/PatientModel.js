// models/patientModel.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    patientName: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false,
        min: 0,
        max: 150
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    needsProfileCompletion: {
        type: Boolean,
        default: true
    }
}, {
    collection: 'Patient'
});

module.exports = mongoose.model('Patient', patientSchema);
