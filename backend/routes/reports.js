const express = require('express');
const router = express.Router();
const { generateReport, compareMultipleSensors } = require('../utils/dynamodb.js');

router.post('/generate', async (req, res) => {
    try {
        const { sensorIds, reportType, startTime, endTime } = req.body;

        if (!Array.isArray(sensorIds) || sensorIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid sensorIds array' });
        }

        console.log('Generating report for:', { sensorIds, reportType, startTime, endTime });

        const data = {
            type: sensorIds.length > 1 ? 'comparison' : 'single',
            reportType,
            timeRange: { startTime, endTime },
            reportData: sensorIds.length > 1
                ? await compareMultipleSensors(sensorIds, reportType, startTime, endTime)
                : await generateReport(sensorIds[0], reportType, startTime, endTime)
        };

        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
    }
});

module.exports = router;
