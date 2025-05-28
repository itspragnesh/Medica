import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App'; // Assuming AuthContext is defined in App.js
import '../App.css';

const YourOrders = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Used for logout

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true); // New loading state for orders list
  const [loadingCancel, setLoadingCancel] = useState(false); // New loading state for cancellation
  const [error, setError] = useState(null);

  const FALLBACK_IMAGE = 'https://via.placeholder.com/60x60.png?text=Image';
  const BASE_SERVER_URL = 'http://localhost:5000'; // Centralize server URL

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_SERVER_URL}/api/orders`, {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in to view your orders.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched orders:', data);

      if (!Array.isArray(data)) { // Ensure data is an array
        throw new Error('Invalid orders data received.');
      }

      // Prepend server URL to image paths for all orders, handling null/undefined medicine objects
      const updatedOrders = data.map(order => ({
        ...order,
        items: order.items.map(item => {
          // Check if item.medicine exists before accessing its properties
          const medicineData = item.medicine ? {
            ...item.medicine,
            image: item.medicine.image && item.medicine.image.startsWith('http')
              ? item.medicine.image
              : `${BASE_SERVER_URL}${item.medicine.image}`,
            companyImage: item.medicine.companyImage
              ? (item.medicine.companyImage.startsWith('http')
                ? item.medicine.companyImage
                : `${BASE_SERVER_URL}${item.medicine.companyImage}`)
              : null,
          } : {
            // Provide fallback properties if medicine is null/undefined
            _id: item._id || 'unknown', // Fallback ID for key
            brandName: 'Unknown Medicine',
            company: 'N/A',
            formula: 'N/A',
            price: 0,
            image: FALLBACK_IMAGE, // Use fallback image
            companyImage: null,
          };

          return {
            ...item,
            medicine: medicineData,
          };
        }),
      }));
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(`Failed to load orders: ${err.message}. Please try again.`);
      setOrders([]); // Clear orders on error
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Empty dependency array means this runs once on mount

  const formatPrice = (price) => (typeof price === 'number' ? price : parseFloat(price) || 0).toFixed(2);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleInitiateCancel = (orderId) => {
    if (!orderId || typeof orderId !== 'string') {
      console.error('Invalid orderId for cancellation:', orderId);
      alert('Invalid order ID for cancellation. Please try again.');
      return;
    }
    setCancelOrderId(orderId);
    setCancelReason('');
    setCustomReason('');
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelOrderId(null);
    setCancelReason('');
    setCustomReason('');
  };

  const handleCancelReasonChange = (e) => {
    setCancelReason(e.target.value);
    if (e.target.value !== 'Others') {
      setCustomReason('');
    }
  };

  const handleConfirmCancel = async () => {
    if (loadingCancel) return; // Prevent double submission

    if (!cancelReason) {
      alert('Please select a cancellation reason.');
      return;
    }

    const finalReason = cancelReason === 'Others' ? customReason : cancelReason;
    if (!finalReason) {
      alert('Please specify a reason for cancellation.');
      return;
    }

    if (!cancelOrderId) {
      console.error('No cancelOrderId set');
      alert('Error: No order selected for cancellation.');
      return;
    }

    setLoadingCancel(true); // Set loading state for cancellation
    try {
      const payload = { orderId: cancelOrderId, cancellationReason: finalReason };
      console.log('Sending cancellation payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${BASE_SERVER_URL}/api/orders/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Cancellation API Response:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        alert('Order cancelled successfully!');
        // Update the specific order in the state without re-fetching all orders
        setOrders(prevOrders => prevOrders.map(order =>
          order._id === cancelOrderId ? {
            ...order,
            status: 'Cancelled',
            cancellationReason: data.order.cancellationReason, // Use reason from backend
            items: data.order.items.map(item => ({ // Ensure image URLs are correct after update
                ...item,
                medicine: item.medicine ? { // Conditional check here too for safety
                    ...item.medicine,
                    image: item.medicine.image && item.medicine.image.startsWith('http') ? item.medicine.image : `${BASE_SERVER_URL}${item.medicine.image}`,
                    companyImage: item.medicine.companyImage ? (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `${BASE_SERVER_URL}${item.medicine.companyImage}`) : null,
                } : { // Fallback for medicine if it's null in the updated data
                    _id: item._id || 'unknown',
                    brandName: 'Unknown Medicine',
                    company: 'N/A',
                    formula: 'N/A',
                    price: 0,
                    image: FALLBACK_IMAGE,
                    companyImage: null,
                },
            })),
          } : order
        ));

        // If the cancelled order was the one being viewed in the detail modal, update it
        if (selectedOrder && selectedOrder._id === cancelOrderId) {
          setSelectedOrder(prevSelected => ({
            ...prevSelected,
            status: 'Cancelled',
            cancellationReason: data.order.cancellationReason,
            items: data.order.items.map(item => ({ // Ensure image URLs are correct after update
                ...item,
                medicine: item.medicine ? { // Conditional check here too for safety
                    ...item.medicine,
                    image: item.medicine.image && item.medicine.image.startsWith('http') ? item.medicine.image : `${BASE_SERVER_URL}${item.medicine.image}`,
                    companyImage: item.medicine.companyImage ? (item.medicine.companyImage.startsWith('http') ? item.medicine.companyImage : `${BASE_SERVER_URL}${item.medicine.companyImage}`) : null,
                } : { // Fallback for medicine if it's null in the updated data
                    _id: item._id || 'unknown',
                    brandName: 'Unknown Medicine',
                    company: 'N/A',
                    formula: 'N/A',
                    price: 0,
                    image: FALLBACK_IMAGE,
                    companyImage: null,
                },
            })),
          }));
        }

        handleCloseCancelModal();
      } else {
        console.error('Cancellation API Error:', data);
        const errorMessage = data.message || 'Unknown error';
        const errorDetails = data.errors ? data.errors.map(e => e.msg).join(', ') : data.error || '';
        alert(`Failed to cancel order: ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(`Error cancelling order: ${error.message}. Please try again.`);
    } finally {
      setLoadingCancel(false); // Reset loading state
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_SERVER_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        navigate('/login');
      } else {
        alert(data.message || 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert(`Logout failed: ${error.message}.`);
    }
  };

  const cancellationReasons = ['Changed my mind', 'Found a better price elsewhere', 'Order placed by mistake', 'Others'];

  return (
    <div className="your-orders-container">
      <nav className="your-orders-nav">
        <div className="your-orders-logo">
          <Link to="/">Medica</Link>
        </div>
        <div>
          <Link to="/pharma" className="your-orders-nav-link">Back to Pharma</Link>
          <button onClick={handleLogout} className="your-orders-nav-link">Logout</button>
        </div>
      </nav>

      <section className="your-orders-section">
        <h1 className="your-orders-title">Your Orders</h1>
        {loadingOrders ? (
          <div className="your-orders-loading">Loading your orders...</div>
        ) : error ? (
          <div className="your-orders-error">{error}</div>
        ) : orders.length === 0 ? (
          <p className="your-orders-empty">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="your-orders-card">
              <div className="your-orders-card-header">
                <h2 className="your-orders-card-title">Order #{order._id}</h2>
                <span className={`your-orders-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <p className="your-orders-info"><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p className="your-orders-info"><strong>Total:</strong> ₹{formatPrice(order.totalPrice)}</p>
              <p className="your-orders-info"><strong>Items:</strong> {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button className="your-orders-view-details" onClick={() => handleViewDetails(order)}>View Details</button>
                {order.status === 'Processing' && (
                  <button
                    className="your-orders-cancel-order"
                    onClick={() => handleInitiateCancel(order._id)}
                    disabled={loadingCancel} // Disable if another cancellation is in progress
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                  >
                    {loadingCancel && cancelOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      {selectedOrder && (
        <div className="your-orders-modal-overlay" onClick={handleCloseModal}>
          <div className="your-orders-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="your-orders-modal-close" onClick={handleCloseModal}>×</button>
            <h2 className="your-orders-modal-title">Order #{selectedOrder._id}</h2>
            <div className="your-orders-modal-section">
              <h3 className="your-orders-modal-section-title">Order Summary</h3>
              {selectedOrder.items.map((item) => {
                // effectivePrice is the final price from the backend
                const displayPrice = item.effectivePrice;
                // Use optional chaining for originalPrice in case item.medicine is null/undefined
                const originalPrice = item.medicine?.price;
                const isDiscounted = displayPrice < originalPrice; // Check if effectivePrice is less than original

                return (
                  <div key={item.medicine?._id || item._id} className="your-orders-modal-item">
                    <img
                      src={item.medicine?.image || FALLBACK_IMAGE} // Use optional chaining
                      alt={item.medicine?.brandName || 'Medicine Image'} // Use optional chaining
                      className="your-orders-modal-item-image"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="your-orders-modal-item-details">
                      <h4 className="your-orders-modal-item-title">{item.medicine?.brandName || 'N/A'}</h4>
                      <p className="your-orders-modal-item-info"><strong>Company:</strong> {item.medicine?.company || 'N/A'}</p>
                      <p className="your-orders-modal-item-info"><strong>Formula:</strong> {item.medicine?.formula || 'N/A'}</p>
                      <p className="your-orders-modal-item-info"><strong>Price:</strong>
                        {isDiscounted ? (
                          <>
                            <span className="your-orders-modal-item-price-strikethrough">₹{formatPrice(originalPrice)}</span>
                            ₹{formatPrice(displayPrice)}
                          </>
                        ) : (
                          ` ₹${formatPrice(displayPrice)}`
                        )}
                      </p>
                      <p className="your-orders-modal-item-info"><strong>Quantity:</strong> {item.quantity}</p>
                      <p className="your-orders-modal-item-info"><strong>Total:</strong> ₹{formatPrice(displayPrice * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
              <div className="your-orders-modal-total">
                <h4 className="your-orders-modal-total-text">Total: ₹{formatPrice(selectedOrder.totalPrice)}</h4>
              </div>
            </div>

            <div className="your-orders-modal-section">
              <h3 className="your-orders-modal-section-title">Delivery & Payment Details</h3>
              <p className="your-orders-modal-item-info"><strong>Status:</strong> {selectedOrder.status}</p>
              <p className="your-orders-modal-item-info"><strong>Shipping to:</strong> {selectedOrder.userLocation || 'Not specified'}</p>
              <p className="your-orders-modal-item-info"><strong>Payment Method:</strong> {selectedOrder.selectedPayment || 'Not specified'}</p>
              <p className="your-orders-modal-item-info"><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              {selectedOrder.status === 'Cancelled' && (
                <p className="your-orders-modal-item-info"><strong>Cancellation Reason:</strong> {selectedOrder.cancellationReason}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="your-orders-modal-overlay" onClick={handleCloseCancelModal}>
          <div className="your-orders-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="your-orders-modal-close" onClick={handleCloseCancelModal}>×</button>
            <h2 className="your-orders-modal-title">Cancel Order #{cancelOrderId}</h2>
            <div className="your-orders-modal-section">
              <h3 className="your-orders-modal-section-title">Reason for Cancellation</h3>
              <select value={cancelReason} onChange={handleCancelReasonChange} className="your-orders-cancel-reason-select">
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason, idx) => (
                  <option key={idx} value={reason}>{reason}</option>
                ))}
              </select>
              {cancelReason === 'Others' && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please specify your reason"
                  className="your-orders-cancel-reason-textarea"
                />
              )}
              <div className="your-orders-modal-actions">
                <button onClick={handleConfirmCancel} className="your-orders-confirm-cancel-btn" disabled={loadingCancel}>
                  {loadingCancel ? 'Confirming...' : 'Confirm Cancellation'}
                </button>
                <button onClick={handleCloseCancelModal} className="your-orders-close-cancel-btn" disabled={loadingCancel}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default YourOrders;