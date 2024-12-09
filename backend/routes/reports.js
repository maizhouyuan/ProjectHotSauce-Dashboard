const express = require('express');
const router = express.Router();
const { generateReport, compareMultipleSensors } = require('../utils/dynamoDB');

// Generate report for single or multiple sensors
router.post('/generate', async (req, res) => {
    try {
        const {
            sensorIds,  // Array of sensor IDs
            reportType, // 'temperature', 'co2', or 'humidity'
            startTime,
            endTime
        } = req.body;

        console.log('Generating report for:', { sensorIds, reportType, startTime, endTime });

        // If multiple sensors, generate comparison report
        if (sensorIds.length > 1) {
            const comparisonData = await compareMultipleSensors(sensorIds, reportType, startTime, endTime);
            res.status(200).json({
                success: true,
                data: {
                    type: 'comparison',
                    reportType,
                    timeRange: { startTime, endTime },
                    comparisonData
                }
            });
        } else {
            // Single sensor report
            const reportData = await generateReport(sensorIds[0], reportType, startTime, endTime);
            res.status(200).json({
                success: true,
                data: {
                    type: 'single',
                    reportType,
                    timeRange: { startTime, endTime },
                    reportData
                }
            });
        }
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate report',
            error: error.message
        });
    }
});

module.exports = router;