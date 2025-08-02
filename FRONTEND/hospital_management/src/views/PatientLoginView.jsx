import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Safely parse the response
            const rawText = await response.text();
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (parseError) {
                console.error("❌ Failed to parse JSON:", parseError);
                console.error("🚨 Raw server response:", rawText);
                setError("Invalid server response. Please contact support.");
                return;
            }

            if (response.ok) {
                localStorage.setItem('userSession', JSON.stringify({
                    email: data.patient.email,
                    patientId: data.patient._id,
                    patientName: data.patient.patientName,
                    age: data.patient.age,
                    doctorId: data.patient.doctorId,
                    documentPath: data.patient.documentPath,
                    needsProfileCompletion: data.patient.needsProfileCompletion || false,
                    isLoggedIn: true,
                    loginTime: new Date().toISOString()
                }));

                if (data.patient.needsProfileCompletion) {
                    navigate('/pdash');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            {/* Video Background */}
            <video 
                className="video-background"
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src="/ScreenRecording_07-18-2025 1-33-52 am_1.mp4" type="video/mp4" />
                {/* Fallback image if video fails to load */}
            </video>

            {/* Dark Overlay for better text readability */}
            <div className="video-overlay"></div>

            <div className="login-card">
                <div className="login-header">
                    <div className="logo">
                        <img src="/logo-removebg-preview.png" alt="MediLink Logo" className="logo-image" />
                        <h1>MediLink</h1>
                    </div>
                    <p>Welcome! Please enter your email to continue</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={error ? 'error' : ''}
                            required
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>New to MediLink? Your account will be created automatically.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
