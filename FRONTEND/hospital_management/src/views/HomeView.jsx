import React, { useState, useEffect } from 'react';
import "../styles/Home.css";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch doctor information
    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/doctors');
                const data = await response.json();
                
                // Assuming you want the first doctor or a specific doctor
                if (data && data.length > 0) {
                    setDoctorInfo(data[0]); // Get first doctor
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor info:', error);
                setLoading(false);
            }
        };

        fetchDoctorInfo();
    }, []);

    return (
        <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <nav className="top-navbar">
                <div className="logo">
                    <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-image" />
                    <span className="logo-text">MediLink</span>
                </div>
                <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    &#8942;
                </button>
            </nav>

            <div className="main-content">
                <div className="content-area">
                    <div className="flex-sections">
                        <div className="flex-box user-info-box">
                            {loading ? (
                                <p>Loading...</p>
                            ) : doctorInfo ? (
                                <div className="user-info-content">
                                    <div className="profile-section">
                                        <img 
                                            src={`http://localhost:5000/uploads/${doctorInfo.imagePath}`}
                                            alt="Doctor Profile"
                                            className="profile-image"
                                        />
                                    </div>
                                    <div className="info-details">
                                        <div className="info-item">
                                            <span className="value">{doctorInfo.doctorName}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="value">{doctorInfo.department}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="value">{doctorInfo.phoneNumber}</span>
                                        </div>
                                        <div className="info-item">
                                            
                                            <span className="value">{doctorInfo.email}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                            ) : (
                                <p>No doctor information available</p>
                            )}
                        </div>

                        <div className="flex-box">
                            <img
                                src="/IMG_6850-removebg-preview.png"
                                alt="Logo"
                                className="box-logo-A"
                            />
                            <p>Appointments</p>
                        </div>
                        <div className="flex-box">
                            <img
                                src="/IMG_6846-removebg-preview.png"
                                alt="Logo"
                                className="box-logo-MS"
                            />
                            <p>Medical Store</p>
                        </div>
                        <div className="flex-box">
                            <img
                                src="/IMG_6847-removebg-preview.png"
                                alt="Logo"
                                className="box-logo-H"
                            />
                            <p>Hospitals</p>
                        </div>
                        <div className="flex-box">
                            <img
                                src="/IMG_6848_1_-removebg-preview.png"
                                alt="Logo"
                                className="box-logo-EC"
                            />
                            <p>Emergency Cases</p>
                        </div>
                        <div className="flex-box">
                            <img
                                src="/IMG_6849-removebg-preview.png"
                                alt="Logo"
                                className="box-logo-AD"
                            />
                            <p>Available Doctors</p>
                        </div>
                    </div>
                </div>

                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <button className="close-btn" onClick={toggleSidebar} aria-label="Close Sidebar">
                        &times;
                    </button>
                    <div className="sidebar-content">
                        <h2>Menu</h2>
                        <ul>
                            <li>My Profile</li>
                            <li>Appointments</li>
                            <li>Doctors</li>
                            <li>Nearby Hospitals</li>
                            <li>Settings</li>
                            <li>Log out</li>
                        </ul>
                    </div>
                </aside>

                {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
            </div>
        </div>
    );
};

export default Dashboard;
