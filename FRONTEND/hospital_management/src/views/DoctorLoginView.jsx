import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/DoctorLogin.css"
const Login = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault(); // stop form submission
        navigate('/about');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login/d/doctorlog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userSession', JSON.stringify(data.doctor)); 
                navigate('/homepage'); // redirect to dashboard
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error, please try again later');
        }
    };

    return (
        <div className="loginFormContainer">
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
            <div className="logoROLE">
                <img src="/logo-removebg-preview.png" alt="Company Logo" className="logo-imageROLE" />
                <span className="logo-textROLE">MediLink</span>
            </div>
            <form className = "plog" onSubmit={handleSubmit}>
                <h2>Login as Doctor</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <button onClick={handleRegister}>Register</button>
            </form>
        </div>
    );
};

export default Login;
