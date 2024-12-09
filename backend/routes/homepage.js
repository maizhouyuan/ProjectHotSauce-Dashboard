const express = require('express');
const router = express.Router();
const { getYearlyData, getDashboardMetrics } = require('../utils/dynamoDB');

router.get('/', async (req, res) => {
    try {
        const sensorId = "fcf5c497654a";  // Hardcoded sensor ID
        const year = req.query.year || new Date().getFullYear().toString();

        console.log('Processing request for:', { sensorId, year });

        const yearlyData = await getYearlyData(sensorId, year);
        const metrics = await getDashboardMetrics();

        console.log('Sending response with data');
        res.status(200).json({
            success: true,
            data: {
                yearlyData,
                metrics,
            },
        });
    } catch (error) {
        console.error('Homepage route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch homepage data',
            error: error.message,
        });
    }
});

module.exports = router;