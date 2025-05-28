import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

// Placeholder image path
import ContactUsImage from '../assets/images/contact-us-image.png';
import { AuthContext } from '../App';

const ContactUs = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // State for form submission status
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return;

    setSubmitStatus({
      submitted: true,
      success: false,
      message: 'Sending your message...'
    });

    // Create a mailto URL with all the form data
    const recipientEmail = 'pragneshreddygajjala1234@gmail.com';
    const { name, email, subject, message } = formData;

    // Format the email body
    const emailBody = `
Name: ${name}
Email: ${email}

Message:
${message}
    `;

    // Create the mailto URL with Gmail-specific parameters
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Open Gmail in a new window
    const emailWindow = window.open(mailtoLink, '_blank');

    if (emailWindow) {
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Email client opened. Please send the email to complete your message.'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Could not open email client. Please check if pop-ups are blocked.'
      });
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

      {/* Contact Us Section */}
      <section className="contact-us-section">
        <div className="contact-content">
          <h1>Contact Us</h1>
          <p className="intro-text">
            We're here to assist you with all your healthcare needs. Reach out to us for support, inquiries, or feedback—we'd love to hear from you!
          </p>

          <h2>Get in Touch</h2>
          <div className="contact-details">
            <p><strong>Email:</strong> <a href="mailto:pragneshreddygajjala1234@gmail.com">support@medica.com</a></p>
            <p><strong>Phone:</strong> +91 12345 67890</p>
            <p><strong>Address:</strong> Bengaluru, Karnataka, IN 560087</p>
          </div>

          <h2>Send Us a Message</h2>

          {/* Show status messages */}
          {submitStatus.submitted && (
            <div className={`status-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`form-input ${formErrors.name ? 'error-input' : ''}`}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className={`form-input ${formErrors.email ? 'error-input' : ''}`}
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={`form-input ${formErrors.subject ? 'error-input' : ''}`}
              />
              {formErrors.subject && <span className="error-text">{formErrors.subject}</span>}
            </div>

            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className={`form-textarea ${formErrors.message ? 'error-input' : ''}`}
                rows="5"
              ></textarea>
              {formErrors.message && <span className="error-text">{formErrors.message}</span>}
            </div>

            <button type="submit" className="btn1">Send Message</button>
          </form>
        </div>
        <div className="contact-image">
          <img src={ContactUsImage} alt="Contact Medica - Support Team" />
          <div className="image-overlay">
            <p>We're Here to Help You</p>
          </div>
        </div>
      </section>

      <section className="google-maps-section">
        <div className="container">
          <h2>📌🗺️ Our Location</h2>
          <p className="description">
            Visit our facility at the heart of the city. We're always ready to welcome you!
          </p>

          <div className="map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31106.020870279914!2d77.742701!3d12.955681099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1747479775206!5m2!1sen!2sin"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Medica Location"
            ></iframe>
          </div>

          <div className="location-details">
            <p><strong>Address:</strong> Bengaluru, Karnataka, IN 560087</p>
            <p><strong>Phone:</strong> +91 12345 67890</p>
            <p><strong>Email:</strong> support@medica.in</p>
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

export default ContactUs;