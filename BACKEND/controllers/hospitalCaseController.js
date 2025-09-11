const HospitalCase = require("../models/hospitalbookModel");
const Hospital = require("../models/hospitalModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register a bed and send email
exports.registerBed = async (req, res) => {
    const { email, emergency, patientName, hospitalName } = req.body;

    if (!email || !patientName || !hospitalName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const hospital = await Hospital.findOne({ name: hospitalName });
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });
        if (hospital.Bed <= 0) return res.status(400).json({ message: "No beds available" });

        hospital.Bed -= 1;
        await hospital.save();

        const newCase = new HospitalCase({ email, emergency, patientName, hospitalName });
        await newCase.save();

        const mailOptions = {
            from: `"MEDI-LINK SERVICES" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Hospital Bed Booking Confirmation",
            text: `Hello ${patientName},\n\nYour bed has been successfully booked at ${hospitalName}.\nEmergency case: ${emergency ? "Yes" : "No"}.\n\nThank you,\nmediLink Community`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Bed registered successfully. Confirmation email sent.", data: newCase });

    } catch (error) {
        console.error("Error in registerBed:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch only emergency cases
exports.getEmergencyCases = async (req, res) => {
    try {
        const cases = await HospitalCase.find({ emergency: true });
        res.status(200).json(cases);
    } catch (error) {
        console.error("Error fetching emergency cases:", error);
        res.status(500).json({ message: "Server error" });
    }
};
