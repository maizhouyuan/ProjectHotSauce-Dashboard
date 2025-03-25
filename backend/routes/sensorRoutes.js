const express = require('express');
const router = express.Router();
const sensorService = require('../services/sensorService');

// Get all sensors
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/sensors - Fetching all sensors');
    const sensors = await sensorService.getAllSensors();
    console.log('Successfully fetched sensors:', sensors);
    res.json(sensors);
  } catch (error) {
    console.error('Error in GET /api/sensors:', error);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
});

// Get sensors by floor
router.get('/floor/:floor', async (req, res) => {
  try {
    const floor = req.params.floor;
    console.log(`GET /api/sensors/floor/${floor} - Fetching sensors for floor`);
    const sensors = await sensorService.getSensorsByFloor(floor);
    console.log(`Successfully fetched sensors for floor ${floor}:`, sensors);
    res.json(sensors);
  } catch (error) {
    console.error(`Error in GET /api/sensors/floor/${req.params.floor}:`, error);
    res.status(500).json({ error: 'Failed to fetch sensors for floor' });
  }
});

// Get single sensor by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`GET /api/sensors/${id} - Fetching sensor by ID`);
    const sensor = await sensorService.getSensorById(id);
    if (!sensor) {
      console.log(`Sensor ${id} not found`);
      return res.status(404).json({ error: 'Sensor not found' });
    }
    console.log('Successfully fetched sensor:', sensor);
    res.json(sensor);
  } catch (error) {
    console.error(`Error in GET /api/sensors/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
});

module.exports = router; 