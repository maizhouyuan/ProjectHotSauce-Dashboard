const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

// AWS SDK v3: Initialize DynamoDB Client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Use DocumentClient for simpler JSON responses
const dynamoDB = DynamoDBDocumentClient.from(client);

module.exports = {
  // Get yearly average temperature and CO2 data for a specific sensor
  async getYearlyAverages(sensorId, year) {
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
  },

  // Get real-time sensor data
  async getRealTimeData(sensorId) {
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
          const command = new QueryCommand(params);
          const data = await dynamoDB.send(command);
          return data.Items[0] || null;
      } catch (error) {
          console.error("Error getting real-time data:", error);
          throw error;
      }
  },

  // Get sensor counts
  async getSensorCounts() {
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
  },

  // Generate report for a specific sensor within a time range
  async generateReport(sensorId, reportType, startTime, endTime) {
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
  },
  
  // Compare multiple sensors for a given report type and time range
  async compareMultipleSensors(sensorIds, reportType, startTime, endTime) {
    const mergedData = [];

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
            
            // Tag each item with its sensor ID
            const taggedItems = data.Items.map(item => ({
                ...item,
                "Sensor ID": sensorId,
            }));
    
            mergedData.push(...taggedItems);
        } catch (error) {
            console.error(`Error fetching data for sensor ${sensorId}:`, error);
        }
    }
    
    return mergedData;
  },
};