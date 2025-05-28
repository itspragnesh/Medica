import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../App.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { orderId } = location.state || {};
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const FALLBACK_IMAGE = 'https://via.placeholder.com/60x60.png?text=Image';

  useEffect(() => {
    if (!orderId) {
      console.error('No orderId provided');
      setError('No order ID provided. Redirecting to shop.');
      navigate('/pharma');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched order:', data);
        if (data) {
          const updatedOrder = {
            ...data,
            items: data.items.map(item => ({
              ...item,
              medicine: {
                ...item.medicine,
                image: item.medicine.image.startsWith('http') ? item.medicine.image : `http://localhost:5000${item.medicine.image}`,
                companyImage: item.medicine.companyImage ? (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `http://localhost:5000${item.medicine.companyImage}`) : null,
              },
            })),
          };
          setOrder(updatedOrder);
        } else {
          throw new Error('No order data received');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again later.');
        navigate('/pharma');
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const formatPrice = (price) => (typeof price === 'number' ? price : parseFloat(price) || 0).toFixed(2);

  const hasDiscount = (medicineId) => {
    const discountedIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];
    return discountedIds.includes(medicineId.toString());
  };

  const calculateDiscountedPrice = (price) => {
    const discount = 0.18;
    return price * (1 - discount);
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
      alert('Failed to logout. Please try again.');
    }
  };

  if (error) return <div>{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div className="medica-order-confirmation-container">
      <nav className="medica-order-confirmation-nav">
        <div className="medica-order-confirmation-logo">
          <Link to="/">Medica</Link>
        </div>
        <div>
          <Link to="/pharma" className="medica-order-confirmation-nav-link">Back to Pharma</Link>
          <button onClick={handleLogout} className="medica-order-confirmation-nav-link">Logout</button>
        </div>
      </nav>

      <section className="medica-order-confirmation-section">
        <h1 className="medica-order-confirmation-title">Order Confirmation</h1>
        <div className="medica-order-confirmation-card">
          <h2 className="medica-order-confirmation-subtitle">Thank You for Your Order!</h2>
          <p className="medica-order-confirmation-message">Your order has been placed successfully. Below are the details:</p>

          <div className="medica-order-confirmation-summary">
            <h3 className="medica-order-confirmation-summary-title">Order Summary</h3>
            {order.items.length === 0 ? (
              <p className="medica-order-confirmation-empty">No items in the order.</p>
            ) : (
              <div>
                {order.items.map(item => {
                  const isDiscounted = hasDiscount(item.medicine._id);
                  const displayPrice = isDiscounted ? calculateDiscountedPrice(item.medicine.price) : item.medicine.price;
                  return (
                    <div key={item.medicine._id} className="medica-order-confirmation-item">
                      <img
                        src={item.medicine.image}
                        alt={item.medicine.brandName}
                        className="medica-order-confirmation-item-image"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      />
                      <div className="medica-order-confirmation-item-details">
                        <h4 className="medica-order-confirmation-item-title">{item.medicine.brandName}</h4>
                        <p className="medica-order-confirmation-item-info"><strong>Company:</strong> {item.medicine.company}</p>
                        <p className="medica-order-confirmation-item-info"><strong>Price:</strong>
                          {isDiscounted ? (
                            <>
                              <span className="medica-order-confirmation-item-price-strikethrough">₹{formatPrice(item.medicine.price)}</span>
                              ₹{formatPrice(displayPrice)}
                            </>
                          ) : (
                            ` ₹${formatPrice(item.medicine.price)}`
                          )}
                        </p>
                        <p className="medica-order-confirmation-item-info"><strong>Quantity:</strong> {item.quantity}</p>
                        <p className="medica-order-confirmation-item-info"><strong>Total:</strong> ₹{formatPrice(displayPrice * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
                <div className="medica-order-confirmation-total">
                  <h4 className="medica-order-confirmation-total-text">Total: ₹{formatPrice(order.totalPrice)}</h4>
                </div>
              </div>
            )}
          </div>

          <div className="medica-order-confirmation-details">
            <h3 className="medica-order-confirmation-details-title">Delivery & Payment Details</h3>
            <p className="medica-order-confirmation-details-info"><strong>Shipping to:</strong> {order.userLocation || 'Not specified'}</p>
            <p className="medica-order-confirmation-details-info"><strong>Payment Method:</strong> {order.selectedPayment || 'Not specified'}</p>
            <p className="medica-order-confirmation-details-info"><strong>Order Status:</strong> {order.status || 'Pending'}</p>
          </div>

          <Link to="/pharma" className="medica-order-confirmation-button">Continue Shopping</Link>
        </div>
      </section>

      <footer className="medica-order-confirmation-footer">
        <p className="medica-order-confirmation-footer-text">© 2025 Medica. All rights reserved.</p>
        <div className="medica-order-confirmation-footer-links">
          {['About-us', 'Contact', 'Terms', 'Privacy'].map((link, idx) => (
            <Link key={idx} to={`/${link.toLowerCase()}`} className="medica-footer-link">{link}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default OrderConfirmation;