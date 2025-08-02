import React, { useState, useEffect } from 'react';
import "../styles/PatientDashboard.css";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]); // ✅ Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✅ Add error state
    
    // Patient form state
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [time, setTime] = useState('');
    const [patientType, setPatientType] = useState('New');
    const [submitting, setSubmitting] = useState(false); // ✅ Add submitting state

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // ✅ Enhanced fetch doctors function
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('Fetching doctors...');
                const response = await fetch('http://localhost:5000/api/doctors');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Raw API response:', data);
                
                // ✅ Handle different response formats
                let doctorsArray = [];
                
                if (data.success && Array.isArray(data.data)) {
                    // New API format: { success: true, data: [...] }
                    doctorsArray = data.data;
                } else if (Array.isArray(data)) {
                    // Old API format: [...]
                    doctorsArray = data;
                } else {
                    console.warn('Unexpected API response format:', data);
                    throw new Error('Invalid API response format');
                }
                
                console.log('Processed doctors array:', doctorsArray);
                setDoctors(doctorsArray);
                setLoading(false);
                
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError(`Failed to fetch doctors: ${error.message}`);
                setDoctors([]); // ✅ Ensure it's always an array
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // ✅ Enhanced sort function
    const handleSortClick = () => {
        if (!Array.isArray(doctors) || doctors.length === 0) {
            alert('No doctors available to sort');
            return;
        }

        const sortChoice = prompt(`Sort by:\n1. Department (Ascending)\n2. Department (Descending)\n\nEnter 1 or 2:`);
        
        if (!sortChoice || (sortChoice !== '1' && sortChoice !== '2')) {
            alert('Invalid selection');
            return;
        }

        const sortedDoctors = [...doctors].sort((a, b) => {
            if (sortChoice === '1') {
                return a.department.localeCompare(b.department);
            } else {
                return b.department.localeCompare(a.department);
            }
        });

        let doctorsList = `Doctors sorted by department (${sortChoice === '1' ? 'Ascending' : 'Descending'}):\n\n`;
        sortedDoctors.forEach((doctor, index) => {
            doctorsList += `${index + 1}. ${doctor.doctorName} - ${doctor.department}\n`;
        });
        
        alert(doctorsList);
    };

    // ✅ Enhanced form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!patientName || !age || !documentFile || !selectedDoctor) {
            alert('Please fill all required fields');
            return;
        }

        const formData = new FormData();
        formData.append('patientName', patientName);
        formData.append('age', age);
        formData.append('document', documentFile);
        formData.append('doctorId', selectedDoctor);
        formData.append('time', time);
        formData.append('patientType', patientType);

        try {
            setSubmitting(true);
            const response = await fetch('http://localhost:5000/api/patientrecords', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert('Patient record saved successfully!');
                // Reset form
                setPatientName('');
                setAge('');
                setDocumentFile(null);
                setSelectedDoctor('');
                setTime('');
                setPatientType('New');
                
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
                
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error saving patient record:', error);
            alert('Server error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Function to render doctor options safely
    const renderDoctorOptions = () => {
        if (!Array.isArray(doctors)) {
            console.warn('Doctors is not an array:', doctors);
            return <option value="">No doctors available</option>;
        }

        if (doctors.length === 0) {
            return <option value="">No doctors available</option>;
        }

        return doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
                {doctor.doctorName} - {doctor.department}
            </option>
        ));
    };

    return (
        <div className={`dashboard-containerP ${sidebarOpen ? 'sidebar-openP' : ''}`}>
            <nav className="top-navbarP">
                <div className="logoP">
                    <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-imageP" />
                    <span className="logo-textP">MediLink</span>
                </div>
                <button className="sidebar-toggleP" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    &#8942;
                </button>
            </nav>

            <div className="main-contentP">
                <div className="content-areaP">
                    <div className="flex-sectionsP">
                        {/* Patient Registration Form */}
                        <div className="flex-boxP patient-form-box">
                            <h3>Patient Registration</h3>
                            
                            {/* ✅ Show loading/error states */}
                            {loading && (
                                <div className="loading-state">
                                    <p>Loading doctors...</p>
                                </div>
                            )}
                            
                            {error && (
                                <div className="error-state">
                                    <p className="error-message">{error}</p>
                                    <button onClick={() => window.location.reload()}>
                                        Retry
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="patient-form">
                                <div className="form-groupP">
                                    <label>Patient Name *</label>
                                    <input
                                        type="text"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        placeholder="Enter patient name"
                                        disabled={submitting}
                                        required
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Age *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="150"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Enter age"
                                        disabled={submitting}
                                        required
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Document Upload (PDF) *</label>
                                    <input
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={(e) => setDocumentFile(e.target.files[0])}
                                        disabled={submitting}
                                        required
                                    />
                                    {documentFile && (
                                        <small className="file-info">
                                            Selected: {documentFile.name}
                                        </small>
                                    )}
                                </div>

                                <div className="form-groupP">
                                    <label>Select Doctor *</label>
                                    <div className="doctor-select-containerP">
                                        <select
                                            value={selectedDoctor}
                                            onChange={(e) => setSelectedDoctor(e.target.value)}
                                            disabled={submitting || loading}
                                            required
                                        >
                                            <option value="">Choose a doctor</option>
                                            {renderDoctorOptions()}
                                        </select>
                                        <button 
                                            type="button" 
                                            onClick={handleSortClick} 
                                            className="sort-buttonP"
                                            disabled={submitting || loading || !Array.isArray(doctors) || doctors.length === 0}
                                        >
                                            Sort
                                        </button>
                                    </div>
                                    <small className="doctor-count">
                                        {Array.isArray(doctors) ? `${doctors.length} doctors available` : 'Loading doctors...'}
                                    </small>
                                </div>

                                <div className="form-groupP">
                                    <label>Appointment Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Patient Type</label>
                                    <select
                                        value={patientType}
                                        onChange={(e) => setPatientType(e.target.value)}
                                        disabled={submitting}
                                    >
                                        <option value="New">New Patient</option>
                                        <option value="Returning">Returning Patient</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-buttonP"
                                    disabled={submitting || loading}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Registration'}
                                </button>
                            </form>
                        </div>

                        {/* Other flex boxes */}

                        <div className="flex-boxP">
                            <img
                                src="/IMG_6846-removebg-preview.png"
                                alt="Medical Store"
                                className="box-logo-MS"
                            />
                            <p>Medical Store</p>
                        </div>

                        <div className="flex-boxP">
                            <img
                                src="/IMG_6847-removebg-preview.png"
                                alt="Hospitals"
                                className="box-logo-H"
                            />
                            <p>Hospitals</p>
                        </div>
                    </div>
                </div>

                <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <button className="close-btnP" onClick={toggleSidebar} aria-label="Close Sidebar">
                        &times;
                    </button>
                    <div className="sidebar-contentP">
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

                {sidebarOpen && <div className="overlayP" onClick={toggleSidebar}></div>}
            </div>
        </div>
    );
};

export default Dashboard;
