const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRecordRoutes = require("./routes/patientRecordRoutes");
const patientAppointmentRoutes = require("./routes/doctorAppoinmentRoutes");
const medicineRoutes = require("./routes/medicineRoutes"); 

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadPath = path.join(__dirname, "uploads");
const documentsPath = path.join(__dirname, "uploads", "documents");
const imagesPath = path.join(__dirname, "images");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
}

// Serve static files (only once)
app.use("/uploads", express.static("uploads"));
app.use("/documents", express.static(path.join(__dirname, "uploads", "documents")));
app.use('/images', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'public, max-age=86400');
    next();
}, express.static(path.join(__dirname, 'images')));

// API Routes (organized properly)
app.use("/api/doctors", doctorRoutes);
app.use("/api/patientrecords", patientRecordRoutes);
app.use("/api/appointments", patientAppointmentRoutes);
app.use("/api/medicines", medicineRoutes);

// Test routes
app.get("/", (req, res) => {
    res.send({ message: "Backend is running!" });
});

app.get("/about", (req, res) => {
    res.send({ message: "We are a team of developers building cool stuff!" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
