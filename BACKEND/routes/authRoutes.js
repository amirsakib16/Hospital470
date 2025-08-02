const express = require('express');
const router = express.Router();
const { loginPatient } = require('../controllers/authController');

router.post('/login', loginPatient);


module.exports = router;
