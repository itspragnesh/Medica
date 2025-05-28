const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

// Validate environment variables
if (!process.env.MONGO_URI || !process.env.SESSION_SECRET) {
  console.error('Missing required environment variables: MONGO_URI and SESSION_SECRET');
  process.exit(1);
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
}, (error) => {
  if (error) {
    console.error('Failed to initialize session store:', error);
    process.exit(1);
  } else {
    console.log('Session store initialized successfully');
  }
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
}));

// JSON Parsing (first middleware)
app.use(express.json());

// Raw body logging for debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH') {
    let rawBody = '';
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', () => {
      console.log(`Raw Request Body for ${req.method} ${req.url}:`, rawBody);
    });
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Cookies:', req.headers.cookie);
  console.log('Session ID:', req.sessionID);
  console.log('Session User:', req.session.user);
  console.log('Headers:', req.headers);
  if (req.method === 'PATCH' || req.method === 'POST') {
    console.log('Parsed Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Serve static files
app.use(express.static('public'));

// MongoDB Connection
mongoose.set('debug', true); // Enable MongoDB query logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas (medica database)'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth').router); // Access the 'router' property
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));

// Test body parsing endpoint
app.post('/api/test-body', (req, res) => {
  console.log('Test Body Received:', req.body);
  res.status(200).json({ received: req.body });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Test route
app.post('/testsignup', (req, res) => {
  res.status(200).send('Test signup route works!');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Resource not found: ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});