const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartExpenseTracker2026SecretKey';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@expense.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminPass99';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please sign in.' });
    }

    const user = await User.create({ name, email: email.toLowerCase(), password });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect Email or Password!' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been banned. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect Email or Password!' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Login
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (email?.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true, email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, isAdmin: true });
  }

  res.status(401).json({ message: 'Invalid Admin Credentials!' });
});

// Get current user
router.get('/me', auth, (req, res) => {
  if (req.isAdmin) {
    return res.json({ isAdmin: true, email: req.adminEmail });
  }
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

module.exports = router;
