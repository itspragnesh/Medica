import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// Icons
import medideImage from '../assets/images/med identifier.png';
import medoxImage from '../assets/images/medox.png';
import wellbotImage from '../assets/images/healthchatbot.png';
import doctorChopperImage from '../assets/images/chopper.png';
import nearestHospitalImage from '../assets/images/nearmap.png';
import personImage from '../assets/images/person.png';
import { AuthContext } from '../App';

const MedicAIl = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleWellBotClick = () => {
    window.location.href = 'http://localhost:5001/chat';
  };
  const handlemedidenClick = () => {
    window.location.href = 'http://localhost:5002/identify_medicine';
  };
  const handleanalyzeClick = () => {
    window.location.href = 'http://localhost:5003/analyze';
  };
  const handlenearmapClick = () => {
    window.location.href = 'http://localhost:5004/near_map';
  };
  const handleRecommendationClick = () => {
    window.location.href = 'http://localhost:5005/personal';
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/">Medica</Link>
          {user && (
            <span className="user-greeting" aria-label={`Welcome ${user.name || user.email.split('@')[0]}`}>
              Hello,&nbsp;
              <span className="user-name">{user.name || user.email.split('@')[0]}</span>!
            </span>
          )}
        </div>
        <ul className="nav-links">
          {['Home', 'Pharma', 'MedicAIl', 'Appointments', 'Blog Resources', 'About Us', 'Contact Us'].map((link, idx) => (
            <li key={idx}>
              <Link to={`/${link.toLowerCase().replace(/\s/g, '-')}`}>{link}</Link>
            </li>
          ))}
          <li>
            {user ? (
              <button onClick={handleLogout} className="login-btn">Logout</button>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </li>
        </ul>
      </nav>

      {/* MedicAIl Header Section */}
      <section className="medicail-header">
        <div className="medicail-header-content">
          <img src={doctorChopperImage} alt="Doctor Chopper" className="medicail-header-image" />
          <div className="medicail-header-text">
            <h1>Hello, I am Doctor Chopper</h1>
            <p>
              I’m here to revolutionize your healthcare experience with cutting-edge AI. From identifying medications and
              analyzing prescriptions to offering 24/7 health advice, MedicAIl empowers you with personalized, accessible
              solutions. Trust me to guide you toward better health, anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* AI Services Section */}
      <section className="ai-services">
        <h2>Smart AI-Based Medical Assistance Tools</h2>
        <div className="ai-service-cards">
          <div className="ai-service-card" onClick={handlemedidenClick} style={{ cursor: 'pointer' }}>
            <img src={medideImage} alt="Medicine Identifier" className="service-image" />
            <h3>Medicine Identifier</h3>
            <p>Scan and identify medicines instantly.<br />Ensure you're taking the right pills.</p>
          </div>
          <div className="ai-service-card" onClick={handleWellBotClick} style={{ cursor: 'pointer' }}>
            <img src={wellbotImage} alt="WellBot AI" className="service-image" />
            <h3>WellBot AI</h3>
            <p>Your 24/7 health assistant.<br />Get instant health advice anytime.</p>
          </div>
          <div className="ai-service-card" onClick={handleanalyzeClick} style={{ cursor: 'pointer' }}>
            <img src={medoxImage} alt="MeDox Prescription Analyzer" className="service-image" />
            <h3>Prescription Analyzer</h3>
            <p>Identifies and summarizes information from uploaded prescription images</p>
          </div>
        </div>
      </section>

      {/* Nearest Hospital and AI Recommendations Section */}
      <section className="nearest-hospital">
        <h2>And More..</h2>
        <div className="hospital-content" style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div className="hospital-card">
            <img
              src={nearestHospitalImage}
              alt="Nearest Hospitals"
              style={{ width: '100px', height: '110px', borderRadius: '12px' }}
            />
            <h3>Find Nearby Hospitals</h3>
            <p>Locate the closest hospitals instantly.<br />Get route and navigation guidance.</p>
            <button className="btn" onClick={handlenearmapClick} style={{ cursor: 'pointer' }}>Find Now</button>
          </div>

          <div className="hospital-card">
            <img
              src={personImage}
              alt="AI Recommendations"
              style={{ width: '100px', height: '110px', borderRadius: '12px' }}
            />
            <h3>AI-Based Recommendations</h3>
            <p>Get personalized health recommendations<br />based on your medical history and symptoms.</p>
            <button className="btn" onClick={handleRecommendationClick} style={{ cursor: 'pointer' }}>Get Suggestions</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-top">
          <p>© 2025 Medica. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about-us">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact-us">Contact</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Connect with us:</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/pragnesh.reddy.96" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/praxx.9/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/pragnesh-reddy-g-014242255/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicAIl;
