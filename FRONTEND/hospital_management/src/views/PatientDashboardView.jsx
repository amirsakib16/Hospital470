import React, { useState, useEffect } from 'react';
import "../styles/PatientDashboard.css";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Patient form state
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [time, setTime] = useState('');
    const [patientType, setPatientType] = useState('New');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Fetch doctors from database
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/doctors');
                const data = await response.json();
                setDoctors(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Handle sort button click
    const handleSortClick = () => {
        const sortOptions = ['department', 'ascending', 'descending'];
        let sortChoice = prompt(`Sort by:\n1. Department (Ascending)\n2. Department (Descending)\n\nEnter 1 or 2:`);
        
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

        // Display sorted doctors list
        let doctorsList = `Doctors sorted by department (${sortChoice === '1' ? 'Ascending' : 'Descending'}):\n\n`;
        sortedDoctors.forEach((doctor, index) => {
            doctorsList += `${index + 1}. ${doctor.doctorName} - ${doctor.department}\n`;
        });
        
        alert(doctorsList);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!patientName || !age || !documentFile || !selectedDoctor) {
            alert('Please fill all fields');
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
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error saving patient record:', error);
            alert('Server error occurred');
        }
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
                        {/* First flex box - Patient Registration Form */}
                        <div className="flex-boxP patient-form-box">

                            <form onSubmit={handleSubmit} className="patient-form">
                                <div className="form-groupP">
                                    <label>Patient Name</label>
                                    <input
                                        type="text"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        placeholder="Enter patient name"
                                        required
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="150"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Enter age"
                                        required
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Document Upload</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setDocumentFile(e.target.files[0])}
                                        required
                                    />
                                </div>

                                <div className="form-groupP">
                                    <label>Select Doctor</label>
                                    <div className="doctor-select-containerP">
                                        <select
                                            value={selectedDoctor}
                                            onChange={(e) => setSelectedDoctor(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose a doctor</option>
                                            {doctors.map((doctor) => (
                                                <option key={doctor._id} value={doctor._id}>
                                                    {doctor.doctorName} - {doctor.department}
                                                </option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={handleSortClick} className="sort-buttonP">
                                            Sort
                                        </button>
                                    </div>
                                </div>

                                

                                <button type="submit" className="submit-buttonP">
                                    Submit Registration
                                </button>
                            </form>
                        </div>

                        {/* Other 3 flex boxes */}
                        <div className="flex-boxP">
                            <img
                                src="/IMG_6850-removebg-preview.png"
                                alt="Appointments"
                                className="box-logo-A"
                            />
                            <p>Appointments</p>
                        </div>

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
