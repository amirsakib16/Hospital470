import React, { useState, useEffect } from 'react';
import '../styles/MedicineList.css';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/medicines');

            if (!response.ok) {
                throw new Error('Failed to fetch medicines');
            }

            const data = await response.json();
            setMedicines(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setError('Failed to load medicine list');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading medicines...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={fetchMedicines} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="medicine-list-container">
            <div className="header-section">
                <div className="logo">
                    <img src="IMG_7065-removebg-preview.png" alt="Medi Logo" className="logo-imageMedi" />
                </div>

            </div>

            <div className="medicines-grid">
                {medicines.length === 0 ? (
                    <div className="no-medicines">
                        <p>No medicines found</p>
                    </div>
                ) : (
                    medicines.map((medicine) => (
                        <div key={medicine._id} className="medicine-card">
                            <div className="medicine-header">
                                <h3>{medicine.name}</h3>
                                <span className="medicine-id">ID: {medicine.id}</span>
                            </div>

                            <div className="medicine-image">
                                {medicine.image_path ? (
                                    <img
                                        src={`http://localhost:5000/images/${medicine.image_path}`}
                                        alt={medicine.name}
                                        className="medicine-img"
                                        crossOrigin="anonymous"
                                        onError={(e) => {
                                            console.log('Image load error for:', medicine.name);
                                            console.log('Image path:', medicine.image_path);
                                            console.log('Full URL:', `http://localhost:5000/images/${medicine.image_path}`);
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                        onLoad={() => {
                                            console.log('Image loaded successfully:', medicine.image_path);
                                        }}
                                    />
                                ) : null}
                                <div className="no-image" style={{ display: 'none' }}>
                                    <span>Image not available</span>
                                </div>
                            </div>



                            <div className="medicine-details">
                                <div className="detail-item">
                                    <span className="label">Medicine ID:</span>
                                    <span className="value">{medicine.id}</span>
                                </div>

                                <div className="detail-item">
                                    <span className="label">Name:</span>
                                    <span className="value">{medicine.name}</span>
                                </div>
                            </div>

                            <div className="medicine-actions">
                                <button className="view-btn">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicineList;
