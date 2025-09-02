import React, { useState } from "react";
import axios from "axios";
import "../styles/DoctorRecommendation.css";

const DoctorRecommendation = () => {
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) {
            setError("Please enter your symptoms.");
            return;
        }
        setError("");
        try {
            const res = await axios.post("http://localhost:3001/api/doctors/recommend", { symptoms });
            setResult(res.data);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="recFormContainer">
            <form className="recForm" onSubmit={handleSubmit}>
                <h2>Find a Doctor</h2>
                <input
                    type="text"
                    placeholder="Enter your symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />
                <button type="submit">Recommend</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            {result && (
                <div className="results">
                    <h3 className="pred">Predicted Department: {result.department}</h3>
                    <div className="doctor-list">
                        {result.doctors.map((doc, idx) => (
                            <div className="doctor-card" key={idx}>
                                <h4>{doc.doctorName}</h4>
                                <p><strong>Degree:</strong> {doc.degree}</p>
                                <p><strong>Hospital:</strong> {doc.hospital}</p>
                                <p><strong>Department:</strong> {doc.department}</p>
                                <p><strong>📞</strong> {doc.phoneNumber}</p>
                                <p><strong>✉️</strong> {doc.email}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorRecommendation;
