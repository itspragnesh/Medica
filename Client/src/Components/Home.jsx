import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import Homeimg from '../assets/images/homebg1.jpg';
import { AuthContext } from '../App';

const Home = () => {
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

  return (
    <div>
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${Homeimg})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Your Health, Our Priority</h1>
            <p>Book appointments, Order Medicines, and get AI-Based medical support 24/7.</p>
            <Link to="/appointments" className="btn3">Book Now</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <h3>AI-Powered Medical Assistance</h3>
            <p>Get instant support with our AI chatbot for symptoms, prescriptions, and medical queries.</p>
          </div>
          <div className="service-card">
            <h3>Online Pharmacy</h3>
            <p>Order genuine medicines and healthcare products with doorstep delivery.</p>
          </div>
          <div className="service-card">
            <h3>Doctor Appointment Booking</h3>
            <p>Book online consultations or clinic visits with verified doctors in just a few clicks.</p>
          </div>
        </div>
      </section>

      {/* Extra Info Section */}
      <section className="extra-info">
        <h2>Stay Informed, Stay Healthy</h2>
        <div className="extra-info-content">
          <p>
            Medica is more than a platform — it's your healthcare companion. From AI-driven medical support to hassle-free pharmacy and appointment features,
            we strive to bring holistic care to your fingertips.
          </p>
          <ul>
            <li>✔ 24/7 access to healthcare support</li>
            <li>✔ Regular blog updates on wellness & diseases</li>
            <li>✔ Verified medical professionals and trusted pharmacy</li>
            <li>✔ Seamless experience from your home</li>
          </ul>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>AI-Powered Medical Assistance</h3>
            <p>Get instant support and diagnostics powered by intelligent systems.</p>
          </div>
          <div className="feature-card">
            <h3>Affordable Healthcare</h3>
            <p>Access world-class medical services at budget-friendly rates.</p>
          </div>
          <div className="feature-card">
            <h3>Home-Step Delivery</h3>
            <p>Receive medicines and test kits right at your doorstep.</p>
          </div>
          <div className="feature-card">
            <h3>Seamless Appointment Booking</h3>
            <p>Book appointments with doctors quickly and effortlessly.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"The best doctor consultation experience I’ve had online!"</p>
            <p>- Pragnesh Reddy</p>
          </div>
          <div className="testimonial-card">
            <p>"Great service, and the medicine arrived within 24 hours!"</p>
            <p>- Sai Dinesh</p>
          </div>
          <div className="testimonial-card">
            <p>"The AI assistant provided accurate health advice, very helpful."</p>
            <p>- Anirudh Vemuri</p>
          </div>
          <div className="testimonial-card">
            <p>"Booking appointments was quick and easy. Highly recommended."</p>
            <p>- Himavanth Sai</p>
          </div>
          <div className="testimonial-card">
            <p>"Very professional and efficient medical support at home."</p>
            <p>- Monkey D Luffy</p>
          </div>
          <div className="testimonial-card">
            <p>"Fast delivery, excellent AI support, and great service overall."</p>
            <p>- Roronoa Zoro</p>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default Home;