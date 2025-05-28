import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Pharma from './Components/Pharma';
import MedicAIl from './Components/MedicAIl';
import Appointments from './Components/Appointments';
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';
import YourOrders from './Components/Orders';
import Blog from './Components/Blog';
import AboutUs from './Components/Aboutus';
import ContactUs from './Components/Contactus';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Privacy from './Components/Privacy';
import Terms from './Components/Terms';
import FAQ from './Components/FAQ';
import Services from './Components/Services';


// Auth Context
export const AuthContext = createContext();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check-auth', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/pharma" element={<ProtectedRoute><Pharma /></ProtectedRoute>} />
          <Route path="/medicail" element={<ProtectedRoute><MedicAIl /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/your-orders" element={<ProtectedRoute><YourOrders /></ProtectedRoute>} />
          <Route path="/blog-resources" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
          <Route path="/about-us" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
          <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
          <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;