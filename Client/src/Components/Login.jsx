import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../App.css';
import LoginImage from '../assets/images/loginimg.png';
import LoginBackground from '../assets/images/LOGINBACK.png';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Login successful! Welcome back.');
        setUser(data.user); // Set user in context
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setMessage(`Login error: ${error.message}. Please try again later.`);
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${LoginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section className="login-section">
        <div className="login-content">
          <h1>Login to Your Account</h1>
          <p className="intro-text">Welcome to Medica! You need to login first.</p>
          <div className="login-form">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="form-input" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Your Password" className="form-input" />
            <button onClick={handleSubmit} className="btn">Login</button>
          </div>
          {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
          <p className="form-footer">Don’t have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
        <div className="login-image">
          <img src={LoginImage} alt="Login to Medica - Healthcare Access" />
          <div className="image-overlay"><p>Welcome Back to Medica</p></div>
        </div>
      </section>
    </div>
  );
};

export default Login;