const express = require('express');
const router = express.Router();
const doctorAppoinmentController = require('../controllers/doctorAppoinmentController');

// GET patients by doctor ID
router.get('/doctor/:doctorId', doctorAppoinmentController.getPatientsByDoctor);

// GET all patients
router.get('/', doctorAppoinmentController.getAllPatients);


// Download patient document
router.get('/download/:patientId', doctorAppoinmentController.downloadPatientDocument);

module.exports = router;
