const express = require('express');
const router = express.Router();
const dynamodb = require('../utils/dynamodb');

// Get all homepage data
router.get('/data', async (req, res) => {
    try {
        // Define default sensor ID (you might want to make this configurable)
        const defaultSensorId = 'sensor-001';
        const currentYear = new Date().getFullYear().toString();

        // Get all required data in parallel
        const [yearlyData, realTimeData, sensorCounts] = await Promise.all([
            dynamodb.getYearlyAverages(defaultSensorId, currentYear),
            dynamodb.getRealTimeData(defaultSensorId),
            dynamodb.getSensorCounts()
        ]);

        // Format response
        const response = {
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
                temperature: realTimeData ? realTimeData.Temperature : null,
                pm25: realTimeData ? realTimeData['PM2.5'] : null
            },
            sensorCounts: {
                total: sensorCounts.totalSensors,
                working: sensorCounts.workingSensors
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
