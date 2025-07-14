const Medicine = require("../models/medicineModel");
const path = require('path');
const fs = require('fs');

// GET all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find()
            .sort({ id: 1 }); // Sort by id

        res.status(200).json(medicines);
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const { medicineId } = req.params;
        
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json(medicine);
    } catch (error) {
        console.error('Error fetching medicine by ID:', error);
        res.status(500).json({ message: error.message });
    }
};

// CREATE new medicine
exports.createMedicine = async (req, res) => {
    try {
        const { id, name, image_path } = req.body;

        // Basic validation
        if (!id || !name) {
            return res.status(400).json({ 
                message: "Required fields: id, name" 
            });
        }

        const newMedicine = new Medicine({
            id,
            name,
            image_path
        });

        const savedMedicine = await newMedicine.save();
        res.status(201).json(savedMedicine);
    } catch (error) {
        console.error('Error creating medicine:', error);
        res.status(500).json({ message: error.message });
    }
};

// UPDATE medicine
exports.updateMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            medicineId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json(updatedMedicine);
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE medicine
exports.deleteMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        
        const deletedMedicine = await Medicine.findByIdAndDelete(medicineId);
        
        if (!deletedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        res.status(500).json({ message: error.message });
    }
};
