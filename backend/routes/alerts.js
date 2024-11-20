const express = require('express');
const router = express.Router();

// Example alert data (mock data, replace with actual logic later)
const mockAlerts = [
  { alertId: '1', sensorId: '1', message: 'Temperature exceeded 30°C', timestamp: '2024-11-19T10:05:00Z' },
  { alertId: '2', sensorId: '2', message: 'Sensor inactive', timestamp: '2024-11-19T10:10:00Z' },
];

// GET endpoint to retrieve alerts
router.get('/', (req, res) => {
  res.json(mockAlerts); // Return mock alert data
});

// POST endpoint to create an alert (this can be used for testing or creating custom alerts)
router.post('/', (req, res) => {
  const { sensorId, message } = req.body;

  // Simulate adding a new alert
  const newAlert = {
    alertId: String(mockAlerts.length + 1),
    sensorId,
    message,
    timestamp: new Date().toISOString(),
  };

  mockAlerts.push(newAlert);  // Add alert to the list (in a real app, save it to a database)

  res.status(201).json(newAlert);  // Return the new alert
});

module.exports = router;
