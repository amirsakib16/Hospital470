const Feedback = require('../models/feedbackModel');
const Patient = require('../models/PatientModel');

exports.getFeedbackByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: "Email is required." });

        const patient = await Patient.findOne({ email: email.toLowerCase() });
        if (!patient) return res.status(404).json({ message: "Patient not found." });

        const feedbacks = await Feedback.find({ patientId: patient._id });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
