import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleSelect.css';

const RoleSelectView = () => {
    const navigate = useNavigate();

    return (
        <div className="role-select-container">
            {/* Video Background */}
            <video 
                className="video-background-role"
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src="/role.mp4" type="video/mp4" />
                {/* Fallback image if video fails to load */}
                <img src="/download.jpg" alt="Background" />
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="video-overlay-role"></div>

            {/* Logo */}
            <div className="logoROLE">
                <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-imageROLE" />
                <span className="logo-textROLE">MediLink</span>
            </div>

            {/* Role Selection */}
            <div className="role-flex-container">
                {/* Doctor Box */}
                <div 
                    className="role-box"
                    onClick={() => navigate('/doctorLogin')}
                    style={{ cursor: "pointer" }}
                >
                    <img
                        src="/IMG_6945-removebg-preview.png"
                        alt="Doctor Logo"
                        className="box-logo-DoctorLogo"
                    />
                    <span><p>Doctor</p></span>
                </div>

                {/* Patient Box */}
                <div 
                    className="role-box"
                    onClick={() => navigate('/patientLogin')}
                    style={{ cursor: "pointer" }}
                >
                    <img
                        src="/IMG_6946-removebg-preview.png"
                        alt="Patient Logo"
                        className="box-logo-PatientLogo"
                    />
                    <span><p>Patient</p></span>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectView;
