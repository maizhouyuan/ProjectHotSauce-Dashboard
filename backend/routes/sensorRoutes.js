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
    console.error('Error in GET /sensors:', error);
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
    console.error('Error in GET /sensors/:id:', error);
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
});

// Get 24-hour historical data for a sensor
router.get('/:id/history', async (req, res) => {
  try {
    console.log(`Fetching history for sensor ${req.params.id}`);
    const history = await sensorService.getSensorHistory(req.params.id);
    console.log(`Sending ${history.length} historical records`);
    res.json(history);
  } catch (error) {
    console.error('Error in GET /sensors/:id/history:', error);
    res.status(500).json({ error: 'Failed to fetch sensor history' });
  }
});

// Get monthly average temperature data
router.get('/monthly-temperatures', async (req, res) => {
  try {
    console.log('Fetching monthly temperature data');
    
    // Get current year
    const currentYear = new Date().getFullYear().toString();
    console.log('Current year:', currentYear);
    
    // Use existing DynamoDB function to get yearly averages for temperature
    const sensors = await getAllSensors();
    
    // Track monthly data across all sensors
    const monthlyData = {};
    
    // Process all sensors
    for (const sensor of sensors) {
      try {
        // Get yearly temperature data for this sensor
        const sensorYearlyData = await dynamodb.getYearlyAverages(sensor.id, currentYear);
        
        if (sensorYearlyData && sensorYearlyData.length > 0) {
          // Process each month's data
          sensorYearlyData.forEach(monthData => {
            if (!monthlyData[monthData.month]) {
              monthlyData[monthData.month] = { tempSum: 0, count: 0 };
            }
            
            monthlyData[monthData.month].tempSum += monthData.avgTemperature;
            monthlyData[monthData.month].count += 1;
          });
        }
      } catch (sensorError) {
        console.error(`Error processing sensor ${sensor.id} data:`, sensorError);
        // Continue with other sensors
      }
    }
    
    // Convert to array format for the chart
    const result = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      avgTemperature: data.tempSum / data.count
    }));
    
    // Sort chronologically
    result.sort((a, b) => a.month.localeCompare(b.month));
    
    console.log(`Returning ${result.length} monthly temperature records`);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /sensors/monthly-temperatures:', error);
    res.status(500).json({ error: 'Failed to fetch monthly temperature data' });
  }
});

module.exports = router; 