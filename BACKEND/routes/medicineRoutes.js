const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// GET all medicines
router.get('/', medicineController.getAllMedicines);

// GET medicine by ID
router.get('/:medicineId', medicineController.getMedicineById);

// CREATE new medicine
router.post('/', medicineController.createMedicine);

// UPDATE medicine
router.put('/:medicineId', medicineController.updateMedicine);

// DELETE medicine
router.delete('/:medicineId', medicineController.deleteMedicine);

module.exports = router;
