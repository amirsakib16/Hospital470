const express = require('express');
const router = express.Router();
const { registerBed, getEmergencyCases } = require('../controllers/hospitalCaseController');

router.post('/', registerBed);
router.get('/emergency', getEmergencyCases); // GET only emergency:true

module.exports = router;
