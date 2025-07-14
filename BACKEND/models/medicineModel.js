const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image_path: {
        type: String,
        required: false
    }
}, { 
    collection: "MedicineList",
    timestamps: true 
});

module.exports = mongoose.model('Medicine', medicineSchema);
