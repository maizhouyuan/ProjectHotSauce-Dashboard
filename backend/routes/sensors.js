const express = require('express');
const router = express.Router();
const { getSensorsByFloor, addNoteToSensor } = require('../utils/dynamoDB');

// Get all sensors grouped by floor
router.get('/', async (req, res) => {
    try {
        const sensors = await getSensorsByFloor();
        res.status(200).json({
            success: true,
            data: sensors
        });
    } catch (error) {
        console.error('Sensors route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sensors data',
            error: error.message
        });
    }
});

// Add note to a sensor
router.post('/:sensorId/notes', async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { note } = req.body;
        
        const updatedSensor = await addNoteToSensor(sensorId, note);
        res.status(200).json({
            success: true,
            data: updatedSensor
        });
    } catch (error) {
        console.error('Add note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add note',
            error: error.message
        });
    }
});

module.exports = router;