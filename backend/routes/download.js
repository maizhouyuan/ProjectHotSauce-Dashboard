const express = require('express');
const router = express.Router();

// Mock data to simulate download content
const mockDownloadData = [
  { sensorId: '1', reading: 23.5, timestamp: '2024-11-19T10:00:00Z' },
  { sensorId: '2', reading: 18.2, timestamp: '2024-11-19T10:05:00Z' },
];

// Handle POST request for downloading data
router.post('/', (req, res) => {
  const { startTime, endTime, fields } = req.body;
  
  // Simulate filtering data by time range
  const filteredData = mockDownloadData.filter((item) => {
    return item.timestamp >= startTime && item.timestamp <= endTime;
  });

  // Filter data based on selected fields
  const result = filteredData.map((item) => {
    const filteredItem = {};
    fields.forEach((field) => {
      if (item[field] !== undefined) filteredItem[field] = item[field];
    });
    return filteredItem;
  });

  res.json(result);  // Return filtered data
});

module.exports = router;
