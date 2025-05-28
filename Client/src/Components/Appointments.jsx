import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../App.css';

// Navbar Component
const Navbar = () => {
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
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
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
  );
};

// Footer Component
const Footer = () => (
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
);

// Appointments Component
const Appointments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showYourAppointments, setShowYourAppointments] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM',
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched doctors:', data);
        setDoctors(data);
        if (data.length === 0) {
          setError('No doctors available. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors: ' + error.message);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      try {
        const response = await fetch('http://localhost:5000/api/appointments', {
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments: ' + error.message);
      }
    };
    fetchAppointments();
  }, [user, navigate]);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to book an appointment.');
      navigate('/login');
      return;
    }
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please select a doctor, date, and time.');
      return;
    }

    console.log('Booking appointment with:', { doctorId: selectedDoctor._id, date: appointmentDate, time: appointmentTime });

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          date: appointmentDate,
          time: appointmentTime,
        }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error(data.message || 'Failed to book appointment');
      }
      setAppointments([...appointments, data]);
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAppointmentTime('');
      setError('');
      setSuccessMessage('Appointment booked successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Error booking appointment: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      console.log('Attempting to cancel appointment:', appointmentId);
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cancel appointment failed:', { status: response.status, errorText, appointmentId });
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error(`Failed to cancel appointment (Status: ${response.status}, ${errorText})`);
      }
      const data = await response.json();
      // Update appointment status to Cancelled
      setAppointments(appointments.map(app =>
        app._id === appointmentId ? { ...app, status: 'Cancelled' } : app
      ));
      setSuccessMessage('Appointment cancelled successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Cancellation error:', error);
      setError('Error cancelling appointment: ' + error.message);
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="appt-header">
        <h1>Book an Appointment</h1>
        <p>Schedule a consultation with our expert doctors.</p>
      </section>
      <section className="appt-navigation">
        <center>
          <button
            className={`btn2 ${!showYourAppointments ? 'active' : ''}`}
            onClick={() => setShowYourAppointments(false)}
          >
            Book Appointment
          </button>
          &nbsp;&nbsp;
          <button
            className={`btn2 ${showYourAppointments ? 'active' : ''}`}
            onClick={() => setShowYourAppointments(true)}
          >
            Your Appointments
          </button>
        </center>
      </section>
      {!showYourAppointments ? (
        <>
          <section className="appt-doctor-list">
            <h2>Our Doctors</h2>
            <div className="appt-doctor-list">
              {doctors.length === 0 ? (
                <p>No doctors available.</p>
              ) : (
                doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className={`appt-doctor-card ${selectedDoctor?._id === doctor._id ? 'appt-doctor-card-selected' : ''}`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <h3 className="appt-doctor-name">{doctor.name}</h3>
                    <p className="appt-doctor-specialty">{doctor.specialty}</p>
                  </div>
                ))
              )}
            </div>
          </section>
          <section className="appt-form">
            <h3>Book an Appointment</h3>
            {error && <p className="appt-error-message">{error}</p>}
            {successMessage && <p className="appt-success-message">{successMessage}</p>}
            <form onSubmit={handleBookAppointment}>
              <div className="appt-form-group">
                <label>Selected Doctor:</label>
                <p>{selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.specialty})` : 'Please select a doctor'}</p>
              </div>
              <div className="appt-form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="appt-form-group">
                <label>Time:</label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn">Book Appointment</button>
            </form>
          </section>
        </>
      ) : (
        <section className="appt-list">
          <h2>Your Appointments</h2>
          {error && <p className="appt-error-message">{error}</p>}
          {successMessage && <p className="appt-success-message">{successMessage}</p>}
          {appointments.length === 0 ? (
            <p>No appointments scheduled.</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className={`appt-item ${appointment.status === 'Cancelled' ? 'appt-item-cancelled' : ''}`}
              >
                <div className="appt-details">

                  <p><strong>Doctor:</strong> {appointment.doctorId?.name || 'Unknown'}</p>
                  <p><strong>Specialty:</strong> {appointment.doctorId?.specialty || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                </div>
                {appointment.status !== 'Cancelled' && (
                  <button
                    className="btn remove-btn"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      )}
      <Footer />
    </div>
  );
};

export default Appointments;