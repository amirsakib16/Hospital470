const Hospital = require("../models/hospitalModel");

// GET all hospitals
exports.getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
