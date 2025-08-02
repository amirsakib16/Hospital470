const PatientRecord = require('../models/PatientModel'); // This model maps to "PatientInformation"

exports.loginPatient = async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Try to find existing patient
        let patient = await PatientRecord.findOne({ email: email.toLowerCase().trim() });

        if (!patient) {
            // New patient: create minimal profile
            patient = new PatientRecord({
                email: email.toLowerCase().trim(),
                needsProfileCompletion: true
            });

            await patient.save();
        }

        res.status(200).json({
            message: 'Login successful',
            patient
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
