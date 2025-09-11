const express = require('express');
const router = express.Router();
const Feedback = require("../models/feedbackModel"); // Rename to Feedback for clarity

// POST endpoint to store feedback
router.post('/', async (req, res) => {
    try {
        const { patientEmail, doctorId, feedback } = req.body;  // ✅ Use patientEmail

        if (!patientEmail || !doctorId || !feedback) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newFeedback = new Feedback({ patientEmail, doctorId, feedback });  // ✅ save patientEmail
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback saved' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});
router.get('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const feedbacks = await Feedback.find({ patientEmail: email.toLowerCase() });
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this patient.' });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
