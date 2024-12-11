const express = require('express');
const app = express();
const homepageRoutes = require('./routes/homepage');

// Middleware
app.use(express.json());

// Routes
app.use('/api/homepage', homepageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
