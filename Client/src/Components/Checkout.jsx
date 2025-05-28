import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Payment from './Payment';
import '../App.css'; // Assuming your CSS is in App.css

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userLocation, setUserLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FALLBACK_IMAGE = 'https://via.placeholder.com/60x60.png?text=Image';
  const BASE_SERVER_URL = 'http://localhost:5000'; // Centralize server URL

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_SERVER_URL}/api/cart`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in to view your cart.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched cart:', data);

        if (!data || !Array.isArray(data.items)) { // Ensure data.items is an array
            throw new Error('Invalid cart data received.');
        }

        const updatedCart = data.items.map(item => ({
          ...item,
          medicine: {
            ...item.medicine,
            image: item.medicine.image && item.medicine.image.startsWith('http') ? item.medicine.image : `${BASE_SERVER_URL}${item.medicine.image}`,
          },
          // effectivePrice should already be calculated on the backend for cart items
          // or passed from product view. Ensure this is the final price for checkout.
          effectivePrice: item.effectivePrice || item.medicine.price,
        }));
        setCart(updatedCart);
        const total = updatedCart.reduce((sum, item) => sum + (item.effectivePrice * item.quantity), 0);
        setTotalPrice(total);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(`Failed to load cart: ${err.message}. Please refresh and try again.`);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const formatPrice = (price) => (typeof price === 'number' ? price : parseFloat(price) || 0).toFixed(2);

  if (loading) return <div className="medica-checkout-loading">Loading cart...</div>;
  if (error) return <div className="medica-checkout-error">{error}</div>;

  return (
    <div className="medica-checkout-container">
      <nav className="medica-checkout-nav">
        <div className="medica-checkout-logo">
          <Link to="/">Medica</Link>
        </div>
        <Link to="/pharma" className="medica-checkout-nav-link">Back to Pharma</Link>
      </nav>

      <section className="medica-checkout-section">
        <h1 className="medica-checkout-title">Checkout</h1>
        <div className="medica-checkout-cart">
          <h2 className="medica-checkout-subtitle">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="medica-checkout-empty">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.medicine._id} className="medica-checkout-item">
                <img
                  src={item.medicine.image}
                  alt={item.medicine.brandName}
                  className="medica-checkout-item-image"
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <div className="medica-checkout-item-details">
                  <h3 className="medica-checkout-item-title">{item.medicine.brandName}</h3>
                  <p className="medica-checkout-item-info"><strong>Company:</strong> {item.medicine.company}</p>
                  <p className="medica-checkout-item-info"><strong>Price:</strong> ₹{formatPrice(item.effectivePrice)}</p>
                  <p className="medica-checkout-item-info"><strong>Quantity:</strong> {item.quantity}</p>
                  <p className="medica-checkout-item-info"><strong>Total:</strong> ₹{formatPrice(item.effectivePrice * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
          <div className="medica-checkout-total">
            <h3 className="medica-checkout-total-text">Total: ₹{formatPrice(totalPrice)}</h3>
          </div>
        </div>

        <div className="medica-checkout-delivery">
          <h2 className="medica-checkout-subtitle">Delivery Details</h2>
          <input
            type="text"
            placeholder="Enter your city"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            className="medica-checkout-input"
            required
          />
        </div>

        <Payment cart={cart} totalPrice={totalPrice} userLocation={userLocation} />
      </section>

      <footer className="medica-checkout-footer">
        <p className="medica-checkout-footer-text">© 2025 Medica. All rights reserved.</p>
        <div className="medica-checkout-footer-links">
          {['About-us', 'Contact', 'Terms', 'Privacy'].map((link, idx) => (
            <Link key={idx} to={`/${link.toLowerCase()}`} className="medica-footer-link">{link}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Checkout;