import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookBedForm.css';

const BookBedForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const hospitalNameFromPrevPage = location.state?.hospitalName || '';

    const [email, setEmail] = useState('');
    const [emergency, setEmergency] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [hospitalName, setHospitalName] = useState(hospitalNameFromPrevPage);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !patientName || !hospitalName) {
            alert('Please fill all required fields');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/hospitalcase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    emergency,
                    patientName,
                    hospitalName,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to register bed');
            }

            alert('Bed registered successfully!');// Redirect to home or hospital list

        } catch (error) {
            alert('Error registering bed: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="book-bed-container">
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
            <h2>Book a Hospital Bed</h2>
            <form onSubmit={handleSubmit} className="book-bed-form">
                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Emergency Case</label>
                    <button
                        type="button"
                        onClick={() => setEmergency(!emergency)}
                        className={emergency ? 'btn-true' : 'btn-false'}
                    >
                        {emergency ? 'True' : 'False'}
                    </button>
                </div>

                <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Hospital Name *</label>
                    <input
                        type="text"
                        value={hospitalName}
                        readOnly
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Registering...' : 'Register a Seat'}
                </button>
            </form>
        </div>
    );
};

export default BookBedForm;
