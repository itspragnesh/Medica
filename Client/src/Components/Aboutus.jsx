import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// Placeholder image path (replace with your actual image)
import AboutUsImage from '../assets/images/about-us-image.png';
import { AuthContext } from '../App';

const AboutUs = () => {
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

      {/* About Us Section */}
      <section className="about-us-section">
        <div className="about-content">
          <h1>About Medica</h1>
          <p className="intro-text">
            At Medica, we believe healthcare should be accessible, seamless, and empowering. As a leading online healthcare platform, we’re committed to revolutionizing the way you manage your health with cutting-edge technology and compassionate care.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to bridge the gap between you and quality healthcare. Whether you need medicines delivered to your door, a quick consultation with a doctor, or reliable health advice from our AI-powered assistants, we’re here to make it happen—anytime, anywhere.
          </p>

          <h2>Our Journey</h2>
          <p>
            Founded in 2024, Medica started with a simple goal: to make healthcare more accessible for everyone. Over the years, we’ve grown into a trusted platform, serving thousands of users with innovative solutions like AI-driven medical support and hassle-free appointment booking. Today, we’re proud to be your partner in health, delivering care that’s both convenient and reliable.
          </p>

          <h2>What We Offer</h2>
          <h3>Online Medicine Delivery</h3>
          <p>
            Skip the pharmacy lines and order genuine medicines online with ease. We partner with certified suppliers to ensure you receive high-quality healthcare products, delivered straight to your doorstep within hours. From prescription medications to over-the-counter essentials, we’ve got you covered.
          </p>

          <h3>AI-Powered Medical Assistants</h3>
          <p>
            Experience the future of healthcare with our AI medical assistants, available 24/7. Whether you’re experiencing symptoms, need advice on managing a condition, or simply have a health-related question, our intelligent chatbot provides instant, personalized support—empowering you to take charge of your well-being.
          </p>

          <h3>Doctor Appointment Booking</h3>
          <p>
            Finding the right doctor has never been easier. With Medica, you can book appointments with verified doctors in just a few clicks. Choose between online consultations for convenience or in-person visits at a clinic near you. Our seamless scheduling system ensures you get the care you need, when you need it.
          </p>

          <h3>Informative Health Blogs</h3>
          <p>
            Knowledge is power, especially when it comes to your health. Our regularly updated blog offers a wealth of information, from expert tips on staying healthy to in-depth articles on managing chronic conditions. Explore our resources to stay informed and inspired on your journey to better health.
          </p>
        </div>
        <div className="about-image">
          <img src={AboutUsImage} alt="About Medica - Healthcare Services" />
          <div className="image-overlay">
            <p>Delivering Health, One Step at a Time</p>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-cards">
          <div className="team-card">
            <h3>Pragnesh Reddy</h3>
            <p>Designer of this Website</p>
            <p>Medica is user-friendly and visually stunning website, ensuring a seamless experience for all users.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Join the Medica Family</h2>
        <p>
          Ready to take control of your health? Explore our services or reach out to us today to learn more about how we can support you.
        </p>
        <div className="cta-buttons">
          <Link to="/services" className="btn secondary-btn">Explore</Link>
          <Link to="/contact-us" className="btn secondary-btn">Contact Us</Link>
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

export default AboutUs;