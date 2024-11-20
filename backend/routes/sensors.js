const express = require('express');
const router = express.Router();

// Mock data to simulate DynamoDB query results
const mockSensorData = [
  { sensorId: '1', status: 'active', reading: 23.5, timestamp: '2024-11-19T10:00:00Z' },
  { sensorId: '2', status: 'inactive', reading: 0, timestamp: '2024-11-19T10:00:00Z' },
  { sensorId: '3', status: 'active', reading: 18.2, timestamp: '2024-11-19T10:00:00Z' },
];

// Get sensor data (simulating a DynamoDB query)
router.get('/', (req, res) => {
  res.json(mockSensorData);  // Return mock data
});

module.exports = router;
