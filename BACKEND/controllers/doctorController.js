const Doctor = require("../models/doctorModel");

// CREATE
exports.createDoctor = async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .sort({ doctorName: 1 }); // Sort alphabetically by name

        console.log(`📊 Found ${doctors.length} doctors`);
        
        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('❌ Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

// GET doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('❌ Error fetching doctor by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor',
            error: error.message
        });
    }
};

// GET doctors by department
exports.getDoctorsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const doctors = await Doctor.find({ 
            department: { $regex: department, $options: 'i' } 
        }).sort({ doctorName: 1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('❌ Error fetching doctors by department:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors by department',
            error: error.message
        });
    }
};

// GET statistics
exports.getDoctorStats = async (req, res) => {
    try {
        const totalDoctors = await Doctor.countDocuments();
        
        const departmentStats = await Doctor.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalDoctors,
                departmentStats
            }
        });
    } catch (error) {
        console.error('❌ Error fetching doctor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
