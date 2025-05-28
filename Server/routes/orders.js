const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Import the requireAuth middleware from your auth.js file
// Adjust the path if auth.js is not in the same directory (e.g., '../middleware/auth' if it's there)
const { requireAuth } = require('./auth');

// @desc    Create a new order
// @route   POST /api/orders/create
// @access  Private (User must be logged in)
router.post('/create', requireAuth, async (req, res) => { // Apply requireAuth here
  try {
    const { items, totalPrice, userLocation, selectedPayment } = req.body;
    // req.user is now populated by the requireAuth middleware
    const userId = req.user._id; // This will now correctly access the _id

    // Basic server-side validation
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain items.' });
    }
    if (totalPrice === undefined || parseFloat(totalPrice) <= 0) { // Ensure totalPrice is treated as number
      return res.status(400).json({ success: false, message: 'Invalid total price.' });
    }
    if (!userLocation || userLocation.trim() === '') {
      return res.status(400).json({ success: false, message: 'Delivery location is required.' });
    }
    if (!selectedPayment || selectedPayment.trim() === '') {
      return res.status(400).json({ success: false, message: 'Payment method is required.' });
    }

    const orderItems = [];
    let calculatedTotalPrice = 0;

    for (const item of items) {
      // Validate item.medicine as a valid ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(item.medicine)) {
        return res.status(400).json({ success: false, message: `Invalid medicine ID format: ${item.medicine}` });
      }

      const medicine = await Medicine.findById(item.medicine);
      if (!medicine) {
        return res.status(404).json({ success: false, message: `Medicine not found for ID: ${item.medicine}` });
      }

      const actualEffectivePrice = parseFloat(item.effectivePrice);
      if (isNaN(actualEffectivePrice) || actualEffectivePrice <= 0) {
        return res.status(400).json({ success: false, message: `Invalid effective price for medicine ID: ${item.medicine}` });
      }
      if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
          return res.status(400).json({ success: false, message: `Invalid quantity for medicine ID: ${item.medicine}` });
      }

      orderItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        effectivePrice: actualEffectivePrice,
      });
      calculatedTotalPrice += actualEffectivePrice * item.quantity;
    }

    // Optional: Validate totalPrice sent from client against server-calculated total
    // Allow for small floating point discrepancies.
    if (Math.abs(calculatedTotalPrice - parseFloat(totalPrice)) > 0.01) {
      // console.warn(`Client total (${totalPrice}) differs from server calculated total (${calculatedTotalPrice}) for user ${userId}`);
      // In a production environment, you might want to return an error here
      // return res.status(400).json({ success: false, message: 'Total price mismatch. Please refresh cart.' });
    }

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice: calculatedTotalPrice, // Use server calculated total
      userLocation,
      selectedPayment,
      status: 'Processing',
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    // Optionally, clear the user's cart after a successful order
    // Ensure this operation is atomic or handled carefully in a real-world scenario
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ success: true, message: 'Order placed successfully', orderId: savedOrder._id, order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
});

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
router.get('/', requireAuth, async (req, res) => { // Apply requireAuth here
  try {
    const userId = req.user._id; // This will now correctly access the _id
    const orders = await Order.find({ user: userId })
      .populate('items.medicine') // Populate medicine details for each item
      .sort({ orderDate: -1 }); // Sort by newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// @desc    Get a single order by ID for the authenticated user
// @route   GET /api/orders/:orderId
// @access  Private
router.get('/:orderId', requireAuth, async (req, res) => { // Apply requireAuth here
  try {
    const { orderId } = req.params;
    const userId = req.user._id; // This will now correctly access the _id

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format.' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId }) // Ensure order belongs to user
      .populate('items.medicine'); // Populate medicine details

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not authorized.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching single order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details', error: error.message });
  }
});

// @desc    Cancel an order
// @route   POST /api/orders/cancel
// @access  Private
router.post('/cancel', requireAuth, async (req, res) => { // Apply requireAuth here
  try {
    const { orderId, cancellationReason } = req.body;
    const userId = req.user._id; // This will now correctly access the _id

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format.' });
    }
    if (!cancellationReason || cancellationReason.trim() === '') {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required.' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId }); // Find by ID and user to ensure ownership

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not authorized for cancellation.' });
    }

    // Only allow cancellation if the order status is 'Processing' or similar
    if (order.status !== 'Processing') {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled. Current status is ${order.status}.` });
    }

    order.status = 'Cancelled';
    order.cancellationReason = cancellationReason.trim();
    await order.save();

    // Re-populate to send back the updated order with medicine details
    const updatedOrder = await Order.findById(order._id).populate('items.medicine');

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
});

module.exports = router;