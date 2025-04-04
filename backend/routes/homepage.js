const express = require('express');
const router = express.Router();
const dynamodb = require('../utils/dynamodb');

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

module.exports = router;
