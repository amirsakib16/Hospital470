import React, { useState, useEffect } from 'react';
import '../styles/DoctorList.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchDoctors();
        fetchStats();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [doctors, searchTerm, selectedDepartment]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/doctors');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Fetched doctors:', result);
            
            if (result.success) {
                setDoctors(result.data);
                setFilteredDoctors(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch doctors');
            }
            
            setError(null);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setError(`Failed to load doctors: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/doctors/stats');
            const result = await response.json();
            
            if (result.success) {
                setStats(result.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const filterDoctors = () => {
        let filtered = doctors;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by department
        if (selectedDepartment) {
            filtered = filtered.filter(doctor =>
                doctor.department.toLowerCase() === selectedDepartment.toLowerCase()
            );
        }

        setFilteredDoctors(filtered);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-doctor.png';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:5000/uploads/${imagePath}`;
    };

    const getDepartments = () => {
        const departments = [...new Set(doctors.map(doctor => doctor.department))];
        return departments.sort();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading doctors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchDoctors} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        
        <div className="doctor-list-container">
            {/* Header Section */}
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
            <div className="header-section">
                <div className="logo">
                    <img src="/logo-removebg-preview.png" alt="MediLink Logo" className="logo-image" />
                    <h1>MediLink Doctors</h1>
                </div>
                
                {stats && (
                    <div className="stats-section">
                        <div className="stat-card">
                            <h3>{stats.totalDoctors}</h3>
                            <p>Total Doctors</p>
                        </div>
                        <div className="stat-card">
                            <h3>{stats.departmentStats.length}</h3>
                            <p>Departments</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Search and Filter Section */}
            <div className="search-section">
                <div className="search-controls">
                    <input
                        type="text"
                        placeholder="Search doctors, departments, or hospitals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="department-filter"
                    >
                        <option value="">All Departments</option>
                        {getDepartments().map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedDepartment('');
                        }}
                        className="clear-filters"
                    >
                        Clear Filters
                    </button>
                </div>
                
                <div className="results-count">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="doctors-grid">
                
                {filteredDoctors.length === 0 ? (
                    <div className="no-doctors">
                        <p>No doctors found matching your criteria</p>
                    </div>
                ) : (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-cardDDD">
                            <div className="doctor-image">
                                <img
                                    src={getImageUrl(doctor.imagePath)}
                                    alt={doctor.doctorName}
                                    className="doctor-photo"
                                    onError={(e) => {
                                        e.target.src = '/default-doctor.png';
                                    }}
                                />
                            </div>
                            
                            <div className="doctor-info">
                                <h3 className="doctor-name">{doctor.doctorName}</h3>
                                <p className="doctor-degree">{doctor.degree}</p>
                                
                                <div className="doctor-details">
                                    <div className="detail-item">
                                        <span className="label">Department:</span>
                                        <span className="value">{doctor.department}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="label">Hospital:</span>
                                        <span className="value">{doctor.hospital}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="label">Phone:</span>
                                        <span className="value">{doctor.phoneNumber}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="label">Email:</span>
                                        <span className="value">{doctor.email}</span>
                                    </div>
                                    
                                    {doctor.id && (
                                        <div className="detail-item">
                                            <span className="label">ID:</span>
                                            <span className="value">{doctor.id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorList;
