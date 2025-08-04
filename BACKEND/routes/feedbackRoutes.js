const express = require('express');
const router = express.Router();
const Feedback = require("../models/feedbackModel"); // Rename to Feedback for clarity

// POST endpoint to store feedback
router.post('/', async (req, res) => {
    try {
        const { patientId, doctorId, feedback } = req.body;

        const newFeedback = new Feedback({ patientId, doctorId, feedback });
        await newFeedback.save();

        res.status(201).json({ message: 'Feedback saved' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});
router.get('/:patientId', async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ patientId: req.params.patientId }); // ✅ Correct name
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Error retrieving feedback', error });
    }
});

module.exports = router;
