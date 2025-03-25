const { getRealTimeData } = require('../utils/dynamodb');

// Fixed sensor configuration
const SENSOR_CONFIG = [
    // Floor 4
    { id: 'bcff4dd3b24c', name: 'Room 402', floor: '4' },
    { id: '18fe34f753d2', name: 'Room 416', floor: '4' },
    
    // Floor 3
    { id: '2462ab14bae1', name: 'Room 307', floor: '3' },
    
    // Floor 2
    { id: 'bcff4dd3b442', name: 'Room 220', floor: '2' },
    { id: 'a4cf12ff89ae', name: 'Room 216', floor: '2' },
    { id: '08f9e05fd2d3', name: 'Room 210', floor: '2' },
    { id: '485519ee6c1a', name: 'Lounge Space', floor: '2' },
    { id: '485519ee5010', name: 'Study Space', floor: '2' },
    
    // Floor 1
    { id: 'fcf5c497654a', name: 'Main Event Space', floor: '1' },
    { id: '40f52032b5b7', name: 'Staff Workspace', floor: '1' },
    
    // External
    { id: 'd8bfc0c0e514', name: 'Courtyard', floor: 'external' }
];

// Identify if the sensor is active (last update time within 2 hours)
const isSensorActive = (timestamp) => {
    if (!timestamp) return false;
    
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000)); // Time 2 hours ago
    
    return lastUpdate > twoHoursAgo;
};

// Get all sensors with their latest readings
const getAllSensors = async () => {
    try {
        console.log('Attempting to fetch all sensors...');
        const sensors = [];

        // Iterate through fixed sensor configuration
        for (const config of SENSOR_CONFIG) {
            try {
                console.log(`Fetching data for sensor ${config.id}...`);
                const data = await getRealTimeData(config.id);
                console.log(`Data received for sensor ${config.id}:`, data);

                // Determine sensor status based on latest data timestamp
                const status = data && isSensorActive(data.Timestamp) ? 'active' : 'inactive';

                // Create sensor object
                sensors.push({
                    id: config.id,
                    name: config.name,
                    floor: config.floor,
                    status: status,
                    lastReading: data ? {
                        temperature: data.Temperature,
                        humidity: data.Humidity,
                        co2: data.CO2,
                        pm25: data['PM2.5'] || 0,
                        timestamp: data.Timestamp
                    } : {
                        temperature: null,
                        humidity: null,
                        co2: null,
                        pm25: null,
                        timestamp: null
                    }
                });
                console.log(`Processed sensor ${config.id}`);
            } catch (error) {
                console.error(`Error fetching data for sensor ${config.id}:`, error);
                // If data fetch fails, add sensor object but mark as inactive
                sensors.push({
                    id: config.id,
                    name: config.name,
                    floor: config.floor,
                    status: 'inactive',
                    lastReading: {
                        temperature: null,
                        humidity: null,
                        co2: null,
                        pm25: null,
                        timestamp: null
                    }
                });
            }
        }

        console.log('Final processed sensors:', sensors);
        return sensors;
    } catch (error) {
        console.error('Error in getAllSensors:', error);
        throw error;
    }
};

// Get sensors by floor
const getSensorsByFloor = async (floor) => {
    try {
        console.log(`Fetching sensors for floor ${floor}...`);
        const allSensors = await getAllSensors();
        const floorSensors = allSensors.filter(sensor => sensor.floor === floor);
        console.log(`Found ${floorSensors.length} sensors for floor ${floor}`);
        return floorSensors;
    } catch (error) {
        console.error('Error fetching sensors by floor:', error);
        throw error;
    }
};

// Get a single sensor by ID
const getSensorById = async (id) => {
    try {
        console.log(`Fetching data for sensor ${id}...`);
        const config = SENSOR_CONFIG.find(s => s.id === id);
        if (!config) {
            console.log(`No configuration found for sensor ${id}`);
            return null;
        }

        const data = await getRealTimeData(id);
        console.log(`Data received for sensor ${id}:`, data);

        // Determine sensor status based on latest data timestamp
        const status = data && isSensorActive(data.Timestamp) ? 'active' : 'inactive';

        const sensor = {
            id: config.id,
            name: config.name,
            floor: config.floor,
            status: status,
            lastReading: data ? {
                temperature: data.Temperature,
                humidity: data.Humidity,
                co2: data.CO2,
                pm25: data['PM2.5'] || 0,
                timestamp: data.Timestamp
            } : {
                temperature: null,
                humidity: null,
                co2: null,
                pm25: null,
                timestamp: null
            }
        };
        console.log(`Processed sensor data:`, sensor);
        return sensor;
    } catch (error) {
        console.error('Error fetching sensor by ID:', error);
        // If data fetch fails, return sensor configuration but mark as inactive
        const config = SENSOR_CONFIG.find(s => s.id === id);
        if (config) {
            return {
                id: config.id,
                name: config.name,
                floor: config.floor,
                status: 'inactive',
                lastReading: {
                    temperature: null,
                    humidity: null,
                    co2: null,
                    pm25: null,
                    timestamp: null
                }
            };
        }
        throw error;
    }
};

module.exports = {
    getAllSensors,
    getSensorsByFloor,
    getSensorById
}; 