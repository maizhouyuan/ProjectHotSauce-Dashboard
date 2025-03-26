const express = require('express');
const app = express();
const cors = require('cors');

const homepageRoutes = require('./routes/homepage');
// Import the new weather routes
const weatherRoutes = require('./routes/weatherRoutes');
const reportRoutes = require('./routes/reports');
const downloadRoutes = require("./routes/download");
const authRoutes = require("./routes/auth");
const sensorRoutes = require('./routes/sensorRoutes');
const noteRoutes = require('./routes/noteRoutes');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/homepage', homepageRoutes);

// New route for weather-related requests
app.use('/api/weather', weatherRoutes);

app.use('/api/reports', reportRoutes);

app.use("/api/download", downloadRoutes);
app.use("/api/auth", authRoutes);

//default response
//http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Backend server is running!");
});
// Add sensor routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/sensors', noteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
