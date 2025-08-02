import React from 'react';
import '../styles/RoleSelect.css';

const RoleSelectView = () => {
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
                <source src="/ScreenRecording_07-18-2025 3-12-19 pm_1.mp4" type="video/mp4" />
                {/* Fallback image if video fails to load */}
                <img src="/download.jpg" alt="Background" />
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="video-overlay-role"></div>

            <div className="logoROLE">
                <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-imageROLE" />
                <span className="logo-textROLE">MediLink</span>
            </div>

            <div className="role-flex-container">
                <div className="role-box">
                    <img
                        src="/IMG_6945-removebg-preview.png"
                        alt="Doctor Logo"
                        className="box-logo-DoctorLogo"
                    />
                    <span><p>Doctor</p></span>
                </div>
                <div className="role-box">
                    <img
                        src="/IMG_6946-removebg-preview.png"
                        alt="Patient Logo"
                        className="box-logo-PatientLogo"
                    />
                    <span><p>Patient</p></span>
                </div>
                <div className="role-box">
                    <img
                        src="/5B0661FC-0BE4-482E-88B8-E21DC90EB251-removebg-preview.png"
                        alt="Admin Logo"
                        className="box-logo-AdminLogo"
                    />
                    <span><p>Admin</p></span>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectView;
