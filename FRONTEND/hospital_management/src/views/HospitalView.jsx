import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hospital.css";

const HospitalList = () => {
    const [hospitals, setHospitals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/hospitals");
                const data = await response.json();
                setHospitals(data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        };
        fetchHospitals();
    }, []);

    return (
        <div className="hospital-container">
            <video
                    className="video-background-role"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src="bkrnd.mp4" type="video/mp4" />
                    {/* Fallback image if video fails to load */}
                </video>
            {hospitals.map((hospital) => (
                <div key={hospital._id} className="hospital-card">
                    <img
                        src={`http://localhost:5000/images/${hospital.image_path}`}
                        alt={hospital.name}
                        className="hospital-img"
                    />
                    <h2 className="hospital-name">{hospital.name}</h2>
                    <p className="hospital-bed">Beds: {hospital.Bed}</p>

                    {hospital.Bed > 0 ? (
                        <button
                            className="book-btn"
                            onClick={() =>
                                navigate('/bookbed', { state: { hospitalName: hospital.name } })
                            }
                        >
                            Book a Bed
                        </button>

                    ) : (
                        <button className="no-bed-btn" disabled>
                            No Bed Available
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HospitalList;
