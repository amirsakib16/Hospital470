const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRecordRoutes = require("./routes/patientRecordRoutes");
const patientAppointmentRoutes = require("./routes/doctorAppoinmentRoutes");

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadPath = path.join(__dirname, "uploads");
const documentsPath = path.join(__dirname, "uploads", "documents");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
}

// Serve static files (only once)
app.use("/uploads", express.static("uploads"));
app.use("/documents", express.static(path.join(__dirname, "uploads", "documents")));

// API Routes (organized properly)
app.use("/api/doctors", doctorRoutes);
app.use("/api/patientrecords", patientRecordRoutes);
app.use("/api/appointments", patientAppointmentRoutes);

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
