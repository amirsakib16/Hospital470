const express = require('express');
const router = express.Router();
const Patient = require('../models/PatientModel');

router.post('/patient', async (req, res) => {
    try {
        const { email, name, phone } = req.body;

        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newPatient = new Patient({ email, name, phone });
        await newPatient.save();

        res.status(201).json({
            message: 'Registration successful',
            patient: { name: newPatient.name, email: newPatient.email, phone: newPatient.phone }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/patientlog', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ message: 'No user found' });
        }

        // Login success, send patient data
        res.status(200).json({ message: 'Login successful', patient: { name: patient.name, email: patient.email, phone: patient.phone } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


