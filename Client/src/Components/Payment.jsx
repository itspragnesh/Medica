import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Payment = ({ cart, totalPrice, userLocation }) => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('');

  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handlePlaceOrder = async () => {
    // Validate inputs
    if (!selectedPayment) {
      alert('Please select a payment method.');
      return;
    }
    if (!userLocation || typeof userLocation !== 'string' || userLocation.trim() === '') {
      alert('Please enter a valid city in the delivery details.');
      return;
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.error('Invalid cart:', cart);
      alert('Your cart is empty or invalid. Please add items to your cart.');
      return;
    }
    if (!totalPrice || isNaN(parseFloat(totalPrice)) || parseFloat(totalPrice) <= 0) {
      console.error('Invalid totalPrice:', totalPrice);
      alert('Invalid total price. Please try again.');
      return;
    }

    // Validate cart items
    for (const item of cart) {
      if (!item.medicine || !item.medicine._id || !/^[0-9a-fA-F]{24}$/.test(item.medicine._id)) {
        console.error('Invalid medicine in cart item:', item);
        alert('Invalid medicine in cart. Please refresh and try again.');
        return;
      }
      if (!item.quantity || item.quantity < 1) {
        console.error('Invalid quantity in cart item:', item);
        alert('Invalid quantity in cart. Please update your cart.');
        return;
      }
      if (!item.effectivePrice || item.effectivePrice <= 0) {
        console.error('Invalid effectivePrice in cart item:', item);
        alert('Invalid price in cart. Please refresh and try again.');
        return;
      }
    }

    try {
      const payload = {
        items: cart.map(item => ({
          medicine: item.medicine._id,
          quantity: parseInt(item.quantity, 10),
          effectivePrice: parseFloat(item.effectivePrice),
        })),
        totalPrice: parseFloat(totalPrice).toFixed(2),
        userLocation: userLocation.trim(),
        selectedPayment,
      };
      console.log('Sending payload to /api/orders/create:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (data.success) {
        navigate('/order-confirmation', { state: { orderId: data.orderId } });
      } else {
        console.error('API Error:', data);
        const errorMessage = data.message || 'Unknown error';
        const errorDetails = data.errors ? data.errors.map(e => e.msg).join(', ') : data.error || '';
        alert(`Failed to place order: ${errorMessage}${errorDetails ? ' - ' + errorDetails : ''}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Error placing order: ${error.message}. Please check your network or try again.`);
    }
  };

  const formatPrice = (price) => (typeof price === 'number' ? price : parseFloat(price) || 0).toFixed(2);

  return (
    <div className="medica-payment-container">
      <h2 className="medica-payment-title">Payment Details</h2>
      <div>
        <label className="medica-payment-label">
          <strong>Select Payment Method:</strong>
        </label>
        <div className="medica-payment-options">
          {['Credit/Debit Card', 'Net Banking', 'UPI', 'Cash on Delivery'].map((method) => (
            <label key={method} className="medica-payment-option">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={selectedPayment === method}
                onChange={handlePaymentChange}
                className="medica-payment-radio"
              />
              {method}
            </label>
          ))}
        </div>
      </div>
      <p className="medica-payment-total">
        <strong>Total Amount:</strong> ₹{formatPrice(totalPrice)}
      </p>
      <button onClick={handlePlaceOrder} className="medica-payment-button">Place Order</button>
    </div>
  );
};

export default Payment;