import React, { useEffect, useState } from "react";
import "../styles/EmergencyCase.css";

const EmergencyCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/hospitalcase/emergency");
                if (!response.ok) {
                    throw new Error("Failed to fetch emergency cases");
                }
                const data = await response.json();
                setCases(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!cases.length) return <p>No emergency cases found.</p>;

    return (
        <div className="emergency-page">
            {/* 🔹 Navigation Bar */}
            <nav className="navbar">
                <div className="logo-for-em-site">
                    <img
                        src="/logo-removebg-preview.png"
                        alt="Company Logo"
                        className="logo-image-em"
                    />
                    <span className="logo-text-for-em-site">MediLink Emergency Cases</span>
                </div>
            </nav>

            {/* 🔹 Background Video */}
            <video
                className="video-background-role"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="bkrnd.mp4" type="video/mp4" />
            </video>

            {/* 🔹 Emergency Cases */}
            <div className="emergency-cases-container">
                {cases.map((c, index) => (
                    <div className="case-card" key={index}>
                        <div className="case-info">
                            <span className="label">Email:</span>
                            <span className="value">{c.email}</span>
                        </div>
                        <div className="case-info">
                            <span className="label">Patient Name:</span>
                            <span className="value">{c.patientName}</span>
                        </div>
                        <div className="case-info">
                            <span className="label">Hospital:</span>
                            <span className="value">{c.hospitalName}</span>
                        </div>
                        <div className="case-info">
                            <span className="label">Emergency:</span>
                            <span className={`value ${c.emergency ? "yes" : "no"}`}>
                                {c.emergency ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmergencyCases;
