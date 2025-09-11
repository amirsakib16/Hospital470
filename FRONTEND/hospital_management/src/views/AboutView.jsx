import React, { useState } from 'react';
import "../styles/About.css";
import { useNavigate } from 'react-router-dom';

const UserProfileEdit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        doctorName: '',
        department: '',
        hospital: '',
        degree: '',
        phoneNumber: '',
        email: '',
        id: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        try {
            const response = await fetch("http://localhost:5000/api/doctors", {
                method: "POST",
                body: data, // multipart form
            });

            const result = await response.json();

            if (response.ok) {
                alert("Doctor profile saved with image!");
                setFormData({
                    doctorName: '',
                    department: '',
                    hospital: '',
                    degree: '',
                    phoneNumber: '',
                    email: '',
                    id: '',
                    image: null,
                });
            navigate('/doctorLogin');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Server error");
        }
    };


    return (
        <>
        <div className="logoROLE">
                <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-image" />
                <span className="logo-textROLE">MediLink</span>
            </div>
        <div className="profile-edit-container">
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
                
            <h2>DOCTOR PROFILE UPDATE</h2>
            <form className="profile-edit-form" onSubmit={handleSubmit}>
                <label>
                    Doctor Name
                    <input
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleChange}
                        placeholder="Enter doctor name"
                        required
                    />
                </label>
                <label>
                    Department
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Enter department"
                        required
                    />
                </label>
                <label>
                    Hospital
                    <input
                        type="text"
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        placeholder="Enter hospital"
                        required
                    />
                </label>
                <label>
                    Degree
                    <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        placeholder="Enter degree"
                        required
                    />
                </label>
                <label>
                    Phone Number
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </label>
                <label>
                    ID
                    <input
                        type="text"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="Enter ID"
                        required
                    />
                </label>
                <label>
                    Profile Image
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        required
                    />
                </label>

                <button type="submit">Register</button>
            </form>
        </div>
    </>);
    
};

export default UserProfileEdit;
