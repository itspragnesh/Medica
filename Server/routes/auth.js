const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // Assuming your User model is in models/User.js

// Middleware to check authentication and attach user to req.user
const requireAuth = (req, res, next) => {
  // console.log('Executing requireAuth. Session user:', req.session.user); // For debugging
  if (!req.session.user || !req.session.user._id) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
      redirectTo: '/login', // Provide a redirect path for frontend
    });
  }
  // Attach user from session to req.user for easier access in subsequent middleware/routes
  req.user = req.session.user;
  // console.log('Authentication successful. req.user:', req.user); // For debugging
  next();
};

// Signup route
router.post('/signup', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Invalid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        redirectTo: '/login',
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Regenerate session to prevent session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate error during signup:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create session after signup',
        });
      }

      req.session.user = {
        email: newUser.email,
        _id: newUser._id.toString(), // Store as string for consistency
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: req.session.user,
      });
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
      error: error.message,
    });
  }
});

// Login route
router.post('/login', [
  check('email', 'Invalid email').isEmail(),
  check('password', 'Password is required').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, please sign up',
        redirectTo: '/signup',
      });
    }

    // `comparePassword` should be a method on your User schema (e.g., using bcrypt)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Regenerate session to prevent session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regenerate error during login:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create session after login',
        });
      }

      req.session.user = {
        email: user.email,
        _id: user._id.toString(), // Store as string for consistency
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: req.session.user,
      });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

// Check session
router.get('/check-auth', (req, res) => {
  if (req.session.user && req.session.user._id) {
    return res.status(200).json({
      success: true,
      isAuthenticated: true, // Explicit flag
      user: req.session.user,
    });
  } else {
    return res.status(200).json({ // Return 200 with false for not authenticated for frontend convenience
      success: false,
      isAuthenticated: false,
      message: 'Not authenticated',
      redirectTo: '/login',
    });
  }
});

// Protected dashboard route (example of using requireAuth)
router.get('/dashboard', requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome, ${req.user.email} (Authenticated by session)`, // Use req.user
    user: req.user,
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: err.message,
      });
    }

    // Clear the session cookie from the client
    res.clearCookie('connect.sid'); // 'connect.sid' is the default name for express-session cookie

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      redirectTo: '/login', // Inform frontend where to redirect
    });
  });
});

// Export both the router and the requireAuth middleware
module.exports = { router, requireAuth };