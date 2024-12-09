const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getYearlyData = async (sensorId, year) => {
    try {
        // First get all data
        const params = {
            TableName: 'AllDataTest'
        };

        console.log('Scanning table...');
        const result = await dynamoDB.scan(params).promise();
        console.log(`Found ${result.Items.length} items`);

        // Filter and process the data in memory
        const filteredItems = result.Items.filter(item => 
            item['Sensor ID'] === sensorId && 
            item.Timestamp.startsWith(year)
        );

        console.log(`Filtered to ${filteredItems.length} items`);

        // Group by month and calculate averages
        const monthlyData = {};
        filteredItems.forEach(item => {
            const month = item.Timestamp.substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    totalCO2: 0,
                    count: 0
                };
            }
            monthlyData[month].totalCO2 += parseFloat(item.CO2);
            monthlyData[month].count += 1;
        });

        const processedData = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            averageCO2: (data.totalCO2 / data.count).toFixed(2)
        }));

        console.log('Processed data:', processedData);
        return processedData;
    } catch (err) {
        console.error('DynamoDB Error:', err);
        throw err;
    }
};

const getDashboardMetrics = async () => {
    try {
        const params = {
            TableName: 'AllDataTest'
        };

        const data = await dynamoDB.scan(params).promise();
        const totalSensors = new Set(data.Items.map(item => item['Sensor ID']));
        
        let dailyTemperatureSum = 0;
        let dailyCO2Sum = 0;
        
        data.Items.forEach(item => {
            dailyTemperatureSum += parseFloat(item.Temperature);
            dailyCO2Sum += parseFloat(item.CO2);
        });

        const count = data.Items.length;

        return {
            dailyTemperature: count > 0 ? (dailyTemperatureSum / count).toFixed(2) : '0',
            dailyCO2: count > 0 ? (dailyCO2Sum / count).toFixed(2) : '0',
            totalSensors: totalSensors.size
        };
    } catch (err) {
        console.error('Error scanning metrics:', err);
        throw err;
    }
};

const getSensorsByFloor = async () => {
    try {
        const params = {
            TableName: 'AllDataTest'
        };

        const result = await dynamoDB.scan(params).promise();
        console.log(`Found ${result.Items.length} sensors`);

        // Process sensors data
        const sensorsByFloor = {};
        const processedSensors = new Set();

        result.Items.forEach(item => {
            const sensorId = item['Sensor ID'];
            
            // Only process each sensor once
            if (!processedSensors.has(sensorId)) {
                processedSensors.add(sensorId);
                
                // Determine sensor status based on latest readings
                const status = determineSensorStatus(item);
                const floor = Math.ceil(Math.random() * 3); // Replace with actual floor logic
                
                if (!sensorsByFloor[floor]) {
                    sensorsByFloor[floor] = [];
                }
                
                sensorsByFloor[floor].push({
                    sensorId: sensorId,
                    status: status,
                    details: {
                        temperature: item.Temperature,
                        co2: item.CO2,
                        humidity: item.Humidity,
                        lastUpdate: item.Timestamp,
                        notes: item.notes || []
                    }
                });
            }
        });

        return sensorsByFloor;
    } catch (err) {
        console.error('Error fetching sensors:', err);
        throw err;
    }
};

const addNoteToSensor = async (sensorId, note) => {
    try {
        const timestamp = new Date().toISOString();
        const params = {
            TableName: 'AllDataTest',
            Key: {
                'Sensor ID': sensorId,
                'Timestamp': timestamp
            },
            UpdateExpression: 'SET notes = list_append(if_not_exists(notes, :empty_list), :new_note)',
            ExpressionAttributeValues: {
                ':empty_list': [],
                ':new_note': [{
                    timestamp: timestamp,
                    content: note
                }]
            },
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDB.update(params).promise();
        return result.Attributes;
    } catch (err) {
        console.error('Error adding note:', err);
        throw err;
    }
};

// Helper function to determine sensor status
const determineSensorStatus = (sensorData) => {

    // Example - adjust thresholds as needed
    const isWorking = 
        parseFloat(sensorData.Temperature) > 0 &&
        parseFloat(sensorData.CO2) > 0 &&
        parseFloat(sensorData.Humidity) > 0;
    
    return isWorking ? 'working' : 'error';
};


const generateReport = async (sensorId, reportType, startTime, endTime) => {
    try {
        const params = {
            TableName: 'AllDataTest',
            KeyConditionExpression: '#sid = :sensorId AND #ts BETWEEN :start AND :end',
            ExpressionAttributeNames: {
                '#sid': 'Sensor ID',
                '#ts': 'Timestamp'
            },
            ExpressionAttributeValues: {
                ':sensorId': sensorId,
                ':start': startTime,
                ':end': endTime
            }
        };

        const result = await dynamoDB.query(params).promise();
        console.log(`Found ${result.Items.length} records for sensor ${sensorId}`);

        // Process data based on report type
        const processedData = processReportData(result.Items, reportType);

        return {
            sensorId,
            data: processedData,
            summary: generateSummary(processedData, reportType)
        };
    } catch (err) {
        console.error('Error generating report:', err);
        throw err;
    }
};

const compareMultipleSensors = async (sensorIds, reportType, startTime, endTime) => {
    try {
        // Get data for all sensors
        const sensorsData = await Promise.all(
            sensorIds.map(sensorId => generateReport(sensorId, reportType, startTime, endTime))
        );

        // Generate comparison statistics
        const comparison = {
            sensors: sensorsData,
            comparative: {
                averages: {},
                maxValues: {},
                minValues: {}
            }
        };

        // Calculate comparative statistics
        sensorsData.forEach(sensorData => {
            const stats = sensorData.summary;
            comparison.comparative.averages[sensorData.sensorId] = stats.average;
            comparison.comparative.maxValues[sensorData.sensorId] = stats.max;
            comparison.comparative.minValues[sensorData.sensorId] = stats.min;
        });

        return comparison;
    } catch (err) {
        console.error('Error comparing sensors:', err);
        throw err;
    }
};

// Helper function to process report data
const processReportData = (items, reportType) => {
    return items.map(item => ({
        timestamp: item.Timestamp,
        value: parseFloat(item[getReportTypeField(reportType)])
    }));
};

// Helper function to generate summary statistics
const generateSummary = (data, reportType) => {
    const values = data.map(item => item.value);
    return {
        average: calculateAverage(values),
        max: Math.max(...values),
        min: Math.min(...values),
        unit: getReportTypeUnit(reportType)
    };
};

// Helper function to get field name based on report type
const getReportTypeField = (reportType) => {
    switch (reportType.toLowerCase()) {
        case 'temperature':
            return 'Temperature';
        case 'co2':
            return 'CO2';
        case 'humidity':
            return 'Humidity';
        default:
            throw new Error(`Unsupported report type: ${reportType}`);
    }
};

// Helper function to get unit based on report type
const getReportTypeUnit = (reportType) => {
    switch (reportType.toLowerCase()) {
        case 'temperature':
            return '°C';
        case 'co2':
            return 'ppm';
        case 'humidity':
            return '%';
        default:
            return '';
    }
};

// Helper function to calculate average
const calculateAverage = (values) => {
    const sum = values.reduce((a, b) => a + b, 0);
    return (sum / values.length).toFixed(2);
};

module.exports = { 
    getYearlyData, 
    getDashboardMetrics,
    getSensorsByFloor,
    addNoteToSensor,
    generateReport,
    compareMultipleSensors
};