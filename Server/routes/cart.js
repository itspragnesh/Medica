const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

// Middleware to Check Authentication
const isAuthenticated = (req, res, next) => {
  console.log('Session data:', req.session);
  console.log('Request cookies:', req.headers.cookie);
  if (!req.session.user || !req.session.user._id) {
    console.warn('Authentication failed: No user or user._id in session', { sessionUser: req.session.user });
    return res.status(401).json({ success: false, message: 'Unauthorized: Please log in' });
  }
  const userId = req.session.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.warn('Invalid user ID in session', { userId });
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }
  req.session.user._id = userId; // Ensure _id is available
  next();
};

// Get Cart
router.get('/', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching cart for user:', req.session.user._id);
    let cart = await Cart.findOne({ user: req.session.user._id }).populate('items.medicine');
    if (!cart) {
      cart = new Cart({ user: req.session.user._id, items: [] });
      await cart.save();
      console.log('Created new cart for user:', req.session.user._id);
    }
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.medicine && item.medicine._id);
    if (cart.items.length < initialLength) {
      console.warn(`Filtered out ${initialLength - cart.items.length} invalid cart items for user: ${req.session.user._id}`);
      await cart.save();
    }
    res.json({ success: true, items: cart.items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Add to Cart
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { medicineId, quantity, effectivePrice } = req.body;
    if (!medicineId || !quantity || !effectivePrice) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ success: false, message: 'Invalid medicine ID' });
    }
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    let cart = await Cart.findOne({ user: req.session.user._id });
    if (!cart) {
      cart = new Cart({ user: req.session.user._id, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(item => item.medicine.toString() === medicineId);
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].effectivePrice = effectivePrice;
    } else {
      cart.items.push({ medicine: medicineId, quantity, effectivePrice });
    }
    await cart.save();
    await cart.populate('items.medicine');
    cart.items = cart.items.filter(item => item.medicine && item.medicine._id);
    res.json({ success: true, items: cart.items });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Remove from Cart
router.post('/remove', isAuthenticated, async (req, res) => {
  try {
    const { medicineId } = req.body;
    if (!medicineId) {
      return res.status(400).json({ success: false, message: 'Medicine ID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ success: false, message: 'Invalid medicine ID' });
    }
    let cart = await Cart.findOne({ user: req.session.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.medicine && item.medicine.toString() !== medicineId);
    if (cart.items.length === initialLength) {
      console.warn(`No item removed: medicineId ${medicineId} not found in cart for user: ${req.session.user._id}`);
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    await cart.save();
    await cart.populate('items.medicine');
    cart.items = cart.items.filter(item => item.medicine && item.medicine._id);
    res.json({ success: true, items: cart.items });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Clear Cart
router.post('/clear', isAuthenticated, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.session.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.items = [];
    await cart.save();
    res.json({ success: true, items: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;