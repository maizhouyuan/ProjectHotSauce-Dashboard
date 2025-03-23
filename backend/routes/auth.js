const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const { registerUser, authenticateUser } = require("../utils/dynamodb");

// Load environment variables from .env file
dotenv.config();

const generateToken = (user, expiresIn = "1h") => {
  return jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
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
  const { username, password, rememberMe } = req.body;

  try {
      const user = await authenticateUser(username, password);
      if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
      }

      const expiresIn = rememberMe ? "7d" : "1h"; //if click remember me,expire after 7 days; otherwise expire in 1 h 
      const accessToken = generateToken(user, expiresIn);
      //console.log(`[LOGIN] ${username} logged in. RememberMe: ${rememberMe} → Token Expiry: ${expiresIn}`);//debug

      const refreshToken = jwt.sign(
        { username: user.username, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, 
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
  
      res.json({ token: accessToken });
  } catch (error) {
      res.status(500).json({ message: "Login failed", error });
  }
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateToken(user, "1h");
    res.json({ token: accessToken });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict"
  });
  res.json({ message: "Logged out" });
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
