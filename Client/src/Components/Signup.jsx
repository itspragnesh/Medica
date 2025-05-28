import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import SignupImage from '../assets/images/loginimg.png';
import SignupBackground from '../assets/images/LOGINBACK.png';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage(`Signup error: ${error.message}. Please try again later.`);
      console.error('Signup error:', error);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${SignupBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section className="signup-section">
        <div className="signup-content">
          <h1>Create Your Account</h1>
          <p className="intro-text">Join Medica by Signing up</p>
          <div className="signup-form">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="form-input" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="form-input" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="form-input" />
            <button onClick={handleSubmit} className="btn">Sign Up</button>
          </div>
          {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
          <p className="form-footer">Already have an account? <Link to="/login">Login</Link></p>
        </div>
        <div className="signup-image">
          <img src={SignupImage} alt="Sign Up for Medica - Join Healthcare" />
          <div className="image-overlay"><p>Join the Medica Family</p></div>
        </div>
      </section>
    </div>
  );
};

export default Signup;