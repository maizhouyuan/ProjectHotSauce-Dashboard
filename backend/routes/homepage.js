const express = require('express');
const router = express.Router();
const dynamodb = require('../utils/dynamodb');
const sensorService = require('../services/sensorService');

router.get('/data', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear().toString();

    const sensorResults = await Promise.all(
      sensorOptions.map(async (sensor) => {
        try {
          const [yearlyData, realTimeData] = await Promise.all([
            dynamodb.getYearlyAverages(sensor.value, currentYear),
            dynamodb.getRealTimeData(sensor.value)
          ]);

          // Filter out sensors with missing or bad data
          if (!yearlyData || yearlyData.length === 0 || !realTimeData) {
            console.warn(`Skipping ${sensor.label} due to missing data.`);
            return null;
          }

          return {
            sensorId: sensor.value,
            label: sensor.label,
            yearlyData: {
              temperature: yearlyData.map(item => ({
                month: item.month,
                value: item.avgTemperature
              })),
              co2: yearlyData.map(item => ({
                month: item.month,
                value: item.avgCO2
              }))
            },
            realTimeData: {
              temperature: realTimeData?.Temperature ?? null,
              co2: realTimeData?.CO2 ?? null,
              pm25: realTimeData?.['PM2.5'] ?? null
            }
          };
        } catch (sensorErr) {
          console.error(`Error fetching data for ${sensor.label}:`, sensorErr);
          return null;
        }
      })
    );

    // Filter out sensors that returned null
    const filteredSensors = sensorResults.filter(sensor => sensor !== null);

    // Get sensor counts
    const sensorCounts = await dynamodb.getSensorCounts();

    res.status(200).json({
      sensors: filteredSensors,
      sensorCounts: {
        total: sensorCounts?.totalSensors ?? 0,
        working: sensorCounts?.workingSensors ?? 0
      }
    });
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sensor options array for reference
const sensorOptions = [
  { value: 'bcff4dd3b24c', label: 'Sensor 2 - Room 110' },
  { value: 'fcf5c497654a', label: 'Sensor 3 - Main Event Space' },
  { value: 'bcff4dd3b442', label: 'Sensor 4 - Room 220' },
  { value: 'd8bfc0c0e514', label: 'Sensor 5 - Courtyard' },
  { value: 'a4cf12ff89ae', label: 'Sensor 6 - Room 216' },
  { value: '40f52032b5b7', label: 'Sensor 7 - Staff Workspace' },
  { value: '08f9e05fd2d3', label: 'Sensor 8 - Room 210' },
  { value: '485519ee6c1a', label: 'Sensor 9 - Lounge Space' },
  { value: '485519ee5010', label: 'Sensor 10 - Study Space' },
  { value: '2462ab14bae1', label: 'Sensor 11 - Room 307' },
  { value: '98f4abd6f8fa', label: 'Sensor 12 - Room 402' },
  { value: '18fe34f753d2', label: 'Sensor 13 - Room 416' }
];

// Get monthly average temperature data
router.get('/monthly-temperature', async (req, res) => {
  try {
    console.log('Fetching monthly temperature data');
    
    // Get current year
    const currentYear = new Date().getFullYear().toString();
    
    // Use existing DynamoDB function to get yearly averages for temperature
    const sensors = await Promise.all(
      sensorOptions.map(async (sensor) => {
        try {
          return {
            id: sensor.value,
            label: sensor.label
          };
        } catch (error) {
          console.error(`Error processing sensor option ${sensor.value}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values
    const validSensors = sensors.filter(sensor => sensor !== null);
    
    // Track monthly data across all sensors
    const monthlyData = {};
    
    // Process all sensors
    for (const sensor of validSensors) {
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
    console.error('Error in GET /homepage/monthly-temperature:', error);
    res.status(500).json({ error: 'Failed to fetch monthly temperature data' });
  }
});

module.exports = router;