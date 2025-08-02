import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch doctor information
    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/doctors');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Fetched doctor data:', data);
                
                // Handle different response formats
                if (data.success && data.data && data.data.length > 0) {
                    setDoctorInfo(data.data[0]); // New API format
                } else if (Array.isArray(data) && data.length > 0) {
                    setDoctorInfo(data[0]); // Old API format
                } else {
                    setError('No doctor information available');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor info:', error);
                setError(`Failed to fetch doctor information: ${error.message}`);
                setLoading(false);
            }
        };

        fetchDoctorInfo();
    }, []);

    // Navigation handlers
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Sidebar navigation handler
    const handleSidebarNavigation = (item) => {
        setSidebarOpen(false); // Close sidebar
        
        switch(item) {
            case 'My Profile':
                navigate('/about');
                break;
            case 'Appointments':
                navigate('/dapp');
                break;
            case 'Doctors':
                navigate('/alldoc');
                break;
            case 'Nearby Hospitals':
                navigate('/hospitals');
                break;
            case 'Settings':
                navigate('/settings');
                break;
            case 'Log out':
                // Clear user session and redirect to login
                localStorage.removeItem('userSession');
                navigate('/login');
                break;
            default:
                console.log(`Navigation not configured for: ${item}`);
        }
    };

    // Function to get correct image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-doctor.png';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/uploads/${imagePath}`;
    };

    return (
        <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <nav className="top-navbar-for-doctor-site">
                <div className="logo-for-doctor-site">
                    <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-image" />
                    <span className="logo-text-for-doctor-site">MediLink</span>
                </div>
                <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    &#8942;
                </button>
            </nav>

            <div className="main-content">
                <div className="content-area">
                    <div className="flex-sections">
                        {/* User Info Box */}
                        <div className="flex-box user-info-box">
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Loading...</p>
                                </div>
                            ) : error ? (
                                <div className="error-state">
                                    <p className="error-message">{error}</p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="retry-button"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : doctorInfo ? (
                                <div className="user-info-content">
                                    <div className="profile-section">
                                        <img 
                                            src={getImageUrl(doctorInfo.imagePath)}
                                            alt="Doctor Profile"
                                            className="profile-image"
                                            onError={(e) => {
                                                e.target.src = '/default-doctor.png';
                                            }}
                                        />
                                    </div>
                                    <div className="info-details">
                                        <div className="info-item">
                                            <span className="label">Name:</span>
                                            <span className="value">{doctorInfo.doctorName || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Department:</span>
                                            <span className="value">{doctorInfo.department || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Phone:</span>
                                            <span className="value">{doctorInfo.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Email:</span>
                                            <span className="value">{doctorInfo.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No doctor information available</p>
                            )}
                        </div>

                        {/* Navigation Boxes */}
                        <div 
                            className="flex-box clickable"
                            onClick={() => handleNavigate('/dapp')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate('/dapp')}
                        >
                            <img
                                src="/IMG_6850-removebg-preview.png"
                                alt="Appointments"
                                className="box-logo-A"
                            />
                            <p>Appointments</p>
                        </div>

                        <div 
                            className="flex-box clickable"
                            onClick={() => handleNavigate('/med')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate('/med')}
                        >
                            <img
                                src="/IMG_6846-removebg-preview.png"
                                alt="Medical Store"
                                className="box-logo-MS"
                            />
                            <p>Medical Store</p>
                        </div>

                        <div 
                            className="flex-box clickable"
                            onClick={() => handleNavigate('/hospitals')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate('/hospitals')}
                        >
                            <img
                                src="/IMG_6847-removebg-preview.png"
                                alt="Hospitals"
                                className="box-logo-H"
                            />
                            <p>Hospitals</p>
                        </div>

                        <div 
                            className="flex-box clickable"
                            onClick={() => handleNavigate('/emergency')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate('/emergency')}
                        >
                            <img
                                src="/IMG_6848_1_-removebg-preview.png"
                                alt="Emergency Cases"
                                className="box-logo-EC"
                            />
                            <p>Emergency Cases</p>
                        </div>

                        <div 
                            className="flex-box clickable"
                            onClick={() => handleNavigate('/alldoc')}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && handleNavigate('/alldoc')}
                        >
                            <img
                                src="/IMG_6849-removebg-preview.png"
                                alt="Available Doctors"
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
                            {[
                                'My Profile',
                                'Appointments', 
                                'Doctors',
                                'Nearby Hospitals',
                                'Settings',
                                'Log out'
                            ].map((item, index) => (
                                <li 
                                    key={index}
                                    onClick={() => handleSidebarNavigation(item)}
                                    className="sidebar-item"
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSidebarNavigation(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
            </div>
        </div>
    );
};

export default Dashboard;
