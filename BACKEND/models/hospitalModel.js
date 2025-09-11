const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image_path: { type: String, required: true },
    Bed: { type: Number, required: true }
}, { collection: "Hospital" });

module.exports = mongoose.model("Hospital", hospitalSchema);
