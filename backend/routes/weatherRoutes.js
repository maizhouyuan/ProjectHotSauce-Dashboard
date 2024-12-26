const express = require('express');
const router = express.Router();
const { getMonthlyAverageTemperature } = require('../services/weatherService');

// Route to fetch monthly average temperatures
router.get('/monthly-average', async (req, res) => {
  const { latitude, longitude, start_date, end_date } = req.query;

  // Validate required query parameters
  if (!latitude || !longitude || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    // Fetch and process weather data
    const monthlyData = await getMonthlyAverageTemperature(latitude, longitude, start_date, end_date);
    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly average temperature:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;
