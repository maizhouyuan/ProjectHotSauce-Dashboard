const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const { registerUser, authenticateUser } = require("./utils/dynamodb");

// Load environment variables from .env file
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
  );
};

// Register User (Only for non admin)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  if (role === "admin") {
      return res.status(403).json({ message: "Cannot create admin users." });
  }

  try {
      const result = await registerUser(username, password, role || "user");
      res.json(result);
  } catch (error) {
      res.status(500).json({ message: "Registration failed", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await authenticateUser(username, password);
      if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = generateToken(user);
      res.json({ token });
  } catch (error) {
      res.status(500).json({ message: "Login failed", error });
  }
});


// // POST endpoint to log in and generate JWT
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Simulate checking the user credentials
//   if (username === mockUser.username && password === mockUser.password) {
//     // Create a JWT token (set a secret key in .env)
//     const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     return res.json({ token });
//   }

//   // If credentials are invalid, send an error response
//   res.status(401).json({ message: 'Invalid credentials' });
// });

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
// router.use(authenticateJWT);
router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

module.exports = router;
