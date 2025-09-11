const Feedback = require('../models/feedbackModel');

exports.getFeedbackByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: "Email is required." });

        // Directly fetch feedbacks by patientEmail
        const feedbacks = await Feedback.find({ patientEmail: email.toLowerCase() });

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this patient." });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
