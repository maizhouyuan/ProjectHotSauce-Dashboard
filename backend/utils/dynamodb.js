const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcrypt");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

console.log('AWS Credentials Check:', {
    region: process.env.AWS_REGION,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

// AWS SDK v3: Initialize DynamoDB Client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Use DocumentClient for simpler JSON responses
const dynamoDB = DynamoDBDocumentClient.from(client);
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "UsersTable";

// Get real-time sensor data
async function getRealTimeData(sensorId) {
    const params = {
        TableName: "AllDataTest",
        KeyConditionExpression: "#sid = :sensorId",
        ExpressionAttributeNames: {
            "#sid": "Sensor ID",
        },
        ExpressionAttributeValues: {
            ":sensorId": sensorId,
        },
        Limit: 1,
        ScanIndexForward: false, // Get the latest record
    };

    try {
        console.log(`Attempting to query DynamoDB for sensor ${sensorId} with params:`, JSON.stringify(params, null, 2));
        const command = new QueryCommand(params);
        const data = await dynamoDB.send(command);
        console.log(`DynamoDB response for sensor ${sensorId}:`, JSON.stringify(data, null, 2));
        return data.Items[0] || null;
    } catch (error) {
        console.error(`DynamoDB error for sensor ${sensorId}:`, error);
        throw error;
    }
}

// Get historical data for a sensor
async function getHistoricalData(sensorId, startTime, endTime) {
    try {
        console.log(`Attempting to query historical data for sensor ${sensorId}`);
        const params = {
            TableName: "AllDataTest",
            KeyConditionExpression: "#sid = :sensorId AND #ts BETWEEN :start AND :end",
            ExpressionAttributeNames: {
                "#sid": "Sensor ID",
                "#ts": "Timestamp"
            },
            ExpressionAttributeValues: {
                ":sensorId": sensorId,
                ":start": startTime,
                ":end": endTime
            }
        };

        console.log('Query params:', JSON.stringify(params, null, 2));
        const command = new QueryCommand(params);
        const response = await dynamoDB.send(command);
        console.log(`Retrieved ${response.Items.length} historical records`);
        
        return response.Items;
    } catch (error) {
        console.error(`DynamoDB error for historical data of sensor ${sensorId}:`, error);
        throw error;
    }
}

// Get yearly average temperature and CO2 data for a specific sensor
async function getYearlyAverages(sensorId, year) {
    const params = {
        TableName: "AllDataTest",
        KeyConditionExpression: "#sid = :sensorId AND begins_with(#ts, :year)",
        ExpressionAttributeNames: {
            "#sid": "Sensor ID",
            "#ts": "Timestamp",
        },
        ExpressionAttributeValues: {
            ":sensorId": sensorId,
            ":year": year,
        },
    };

    try {
        const command = new QueryCommand(params);
        const data = await dynamoDB.send(command);

        // Process monthly averages
        const monthlyData = {};
        data.Items.forEach((item) => {
            const month = item.Timestamp.substring(0, 7); // Get YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { tempSum: 0, co2Sum: 0, count: 0 };
            }
            monthlyData[month].tempSum += parseFloat(item.Temperature);
            monthlyData[month].co2Sum += parseFloat(item.CO2);
            monthlyData[month].count += 1;
        });

        return Object.entries(monthlyData).map(([month, data]) => ({
            month,
            avgTemperature: data.tempSum / data.count,
            avgCO2: data.co2Sum / data.count,
        }));
    } catch (error) {
        console.error("Error getting yearly averages:", error);
        throw error;
    }
}

// Get sensor counts
async function getSensorCounts() {
    const params = {
        TableName: "AllDataTest",
        ProjectionExpression: "#sid, #ts",
        ExpressionAttributeNames: {
            "#sid": "Sensor ID",
            "#ts": "Timestamp",
        },
    };

    try {
        const command = new ScanCommand(params);
        const data = await dynamoDB.send(command);

        const uniqueSensors = new Set();
        const workingSensors = new Set();
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        data.Items.forEach((item) => {
            uniqueSensors.add(item["Sensor ID"]);
            const timestamp = new Date(item.Timestamp);
            if (timestamp > tenMinutesAgo) {
                workingSensors.add(item["Sensor ID"]);
            }
        });

        return {
            totalSensors: uniqueSensors.size,
            workingSensors: workingSensors.size,
        };
    } catch (error) {
        console.error("Error getting sensor counts:", error);
        throw error;
    }
}

// Generate report for a specific sensor within a time range
async function generateReport(sensorId, reportType, startTime, endTime) {
    const params = {
        TableName: "AllDataTest",
        KeyConditionExpression: "#sid = :sensorId AND #ts BETWEEN :startTime AND :endTime",
        ExpressionAttributeNames: {
            "#sid": "Sensor ID",
            "#ts": "Timestamp",
        },
        ExpressionAttributeValues: {
            ":sensorId": sensorId,
            ":startTime": startTime,
            ":endTime": endTime,
        },
    };

    try {
        const command = new QueryCommand(params);
        const data = await dynamoDB.send(command);
        return data.Items;
    } catch (error) {
        console.error("Error generating report:", error);
        throw error;
    }
}

// Compare multiple sensors for a given report type and time range
async function compareMultipleSensors(sensorIds, reportType, startTime, endTime) {
    const sensorData = {};

    for (const sensorId of sensorIds) {
        const params = {
            TableName: "AllDataTest",
            KeyConditionExpression: "#sid = :sensorId AND #ts BETWEEN :startTime AND :endTime",
            ExpressionAttributeNames: {
                "#sid": "Sensor ID",
                "#ts": "Timestamp",
            },
            ExpressionAttributeValues: {
                ":sensorId": sensorId,
                ":startTime": startTime,
                ":endTime": endTime,
            },
        };

        try {
            const command = new QueryCommand(params);
            const data = await dynamoDB.send(command);
            sensorData[sensorId] = data.Items;
        } catch (error) {
            console.error(`Error fetching data for sensor ${sensorId}:`, error);
            sensorData[sensorId] = [];
        }
    }

    return sensorData;
}

//register user
async function registerUser(username, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
        TableName: USERS_TABLE,
        Item: {
            username,
            password: hashedPassword,
            role,
        },
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        return { success: true, message: "User registered successfully" };
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

// user authentication
async function authenticateUser(username, password) {
    const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ":username": username },
    };

    try {
        const command = new QueryCommand(params);
        const data = await dynamoDB.send(command);

        if (data.Items.length === 0) {
            return null;
        }

        const user = data.Items[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return user;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
}

module.exports = {
    getRealTimeData,
    getHistoricalData,
    getYearlyAverages,
    getSensorCounts,
    generateReport,
    compareMultipleSensors,
    registerUser,
    authenticateUser
};