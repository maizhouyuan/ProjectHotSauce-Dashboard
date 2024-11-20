const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Mock user data (replace this with actual user verification, e.g., database check)
const mockUser = {
  username: 'admin',
  password: 'password123', // In a real app, passwords should be hashed
};

// POST endpoint to log in and generate JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simulate checking the user credentials
  if (username === mockUser.username && password === mockUser.password) {
    // Create a JWT token (set a secret key in .env)
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  // If credentials are invalid, send an error response
  res.status(401).json({ message: 'Invalid credentials' });
});

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) return res.status(403).json({ message: 'Token is required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  });
};

// Protect any routes that need authentication
router.use(authenticateJWT);

module.exports = router;
