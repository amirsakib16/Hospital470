import React, { useState, useEffect } from 'react';
import '../styles/DoctorAppoinment.css';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFeedbackId, setActiveFeedbackId] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [submitStatus, setSubmitStatus] = useState('');

    const currentDoctorId = "688e902029dafca8fb5c5e5b"; 


    useEffect(() => {
        fetchPatientsByDoctor();
    }, []);

    const fetchPatientsByDoctor = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/appointments/doctor/${currentDoctorId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }

            const data = await response.json();
            setPatients(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('Failed to load patient records');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async (patientId, patientName) => {
        try {
            const response = await fetch(`http://localhost:5000/api/appointments/download/${patientId}`);

            if (!response.ok) {
                throw new Error('Failed to download document');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${patientName}_medical_report.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download document');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading patient records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchPatientsByDoctor} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }
    const submitFeedback = async (patientId) => {
        if (!feedbackText.trim()) return;

        try {
            const response = await fetch(`http://localhost:5000/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId: currentDoctorId,
                    feedback: feedbackText,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setSubmitStatus('Feedback submitted successfully!');
            setFeedbackText('');
            setActiveFeedbackId(null);

            setTimeout(() => setSubmitStatus(''), 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('Failed to submit feedback');
        }
    };

    return (
        <div className="doctor-patients-container">
            <div className="header-section">
                <h1>My Patient Records</h1>
                <p>Total Patients: {patients.length}</p>
                <button onClick={fetchPatientsByDoctor} className="refresh-btn">
                    Refresh
                </button>
            </div>

            <div className="patients-grid">
                {patients.length === 0 ? (
                    <div className="no-patients">
                        <p>No patient records found</p>
                    </div>
                ) : (
                    patients.map((patient) => (
                        <div key={patient._id} className="patient-card">
                            <div className="patient-header">
                                <h3>{patient.patientName}</h3>
                                <span className="patient-id">ID: {patient._id.slice(-6)}</span>
                            </div>

                            <div className="patient-details">
                                <div className="detail-item">
                                    <span className="label">Age:</span>
                                    <span className="value">{patient.age} years</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Registered:</span>
                                    <span className="value">
                                        {new Date(patient.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Document:</span>
                                    <span className="value">
                                        {patient.documentPath ? 'Available' : 'Not uploaded'}
                                    </span>
                                </div>
                            </div>

                            <div className="patient-actions">
                                {patient.documentPath ? (
                                    <>
                                        <a
                                            href={`http://localhost:5000${patient.documentPath}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="see-report-btn"
                                        >
                                            Show
                                        </a>
                                        <button
                                            className="download-report-btn"
                                            onClick={() => downloadPDF(patient._id, patient.patientName)}
                                        >
                                            Download Report
                                        </button>
                                    </>
                                ) : (
                                    <span>No report</span>
                                )}
                            </div>
                            <button
                                className="feedback-btn"
                                onClick={() =>
                                    setActiveFeedbackId(activeFeedbackId === patient._id ? null : patient._id)
                                }
                            >
                                Feedback
                            </button>

                            {activeFeedbackId === patient._id && (
                                <div className="feedback-form">
                                    <textarea
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Write your feedback here..."
                                        rows={4}
                                    />
                                    <button className="submit-feedback-btn" onClick={() => submitFeedback(patient._id)}>
                                        Submit
                                    </button>
                                    {submitStatus && <p className="status-msg">{submitStatus}</p>}
                                </div>
                            )}


                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorPatients;
