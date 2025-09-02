import React, { useState, useEffect } from 'react';
import '../styles/MedicineList.css';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // new state for search

    useEffect(() => {
        fetchMedicines(searchQuery);
    }, [searchQuery]); // refetch when searchQuery changes

    const fetchMedicines = async (query = '') => {
        try {
            setLoading(true);
            // Use the search API endpoint if query is not empty, else fetch all
            const url = query
                ? `http://localhost:5000/api/medicines/search?q=${encodeURIComponent(query)}`
                : 'http://localhost:5000/api/medicines';

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            setMedicines(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setError('Failed to load medicine list: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicines(searchQuery);
    }, [searchQuery]);



    return (
        <div className="medicine-list-container">
            <div className="header-section">
                <div className="logo">
                    <img src="IMG_7065-removebg-preview.png" alt="Medi Logo" className="logo-imageMedi" />
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading medicines...</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => fetchMedicines(searchQuery)} className="retry-btn">Retry</button>
                </div>
            ) : (
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
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
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
                                    <button className="view-btn">View Details</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MedicineList;
