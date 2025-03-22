const jwt = require("jsonwebtoken");
require("dotenv").config();

//Generates a JWT token for a given user.
//The token includes the user's username and role in the payload
//and is set to expire in 1 hour.
const generateToken = (user) => {
    return jwt.sign(
        { username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

//verifies a JWT token using the secret key
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
