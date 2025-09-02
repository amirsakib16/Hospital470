import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/PatientRegister.css"
const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/register/patient', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userSession', JSON.stringify(data.patient));
                navigate('/pdash'); // Redirect to dashboard
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server error, try again later');
        }
    };

    return (
        <div className='patientregform'>
            <h1 className='reg'>Patient Registration Form</h1>
        <form className = "pregF" onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            <button type="submit">Register</button>
        </form>
        </div>
    );
};

export default Register;
