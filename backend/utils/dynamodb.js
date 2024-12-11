const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Export functions for DynamoDB operations
module.exports = {
  // Get yearly average temperature and CO2 data for a specific sensor
  async getYearlyAverages(sensorId, year) {
      const params = {
          TableName: 'AllDataTest',
          KeyConditionExpression: '#sid = :sensorId AND begins_with(#ts, :year)',
          ExpressionAttributeNames: {
              '#sid': 'Sensor ID',
              '#ts': 'Timestamp'
          },
          ExpressionAttributeValues: {
              ':sensorId': sensorId,
              ':year': year
          }
      };

      try {
          const data = await dynamoDB.query(params).promise();
          
          // Process monthly averages
          const monthlyData = {};
          data.Items.forEach(item => {
              const month = item.Timestamp.substring(0, 7); // Get YYYY-MM
              if (!monthlyData[month]) {
                  monthlyData[month] = {
                      tempSum: 0,
                      co2Sum: 0,
                      count: 0
                  };
              }
              monthlyData[month].tempSum += parseFloat(item.Temperature);
              monthlyData[month].co2Sum += parseFloat(item.CO2);
              monthlyData[month].count += 1;
          });

          // Calculate averages
          return Object.entries(monthlyData).map(([month, data]) => ({
              month,
              avgTemperature: data.tempSum / data.count,
              avgCO2: data.co2Sum / data.count
          }));
      } catch (error) {
          console.error('Error getting yearly averages:', error);
          throw error;
      }
  },

  // Get real-time sensor data
  async getRealTimeData(sensorId) {
      const params = {
          TableName: 'AllDataTest',
          KeyConditionExpression: '#sid = :sensorId',
          ExpressionAttributeNames: {
              '#sid': 'Sensor ID'
          },
          ExpressionAttributeValues: {
              ':sensorId': sensorId
          },
          Limit: 1,
          ScanIndexForward: false // Get the latest record
      };

      try {
          const data = await dynamoDB.query(params).promise();
          return data.Items[0] || null;
      } catch (error) {
          console.error('Error getting real-time data:', error);
          throw error;
      }
  },

  // Get sensor counts
  async getSensorCounts() {
      const params = {
          TableName: 'AllDataTest',
          ProjectionExpression: '#sid, #ts',
          ExpressionAttributeNames: {
              '#sid': 'Sensor ID',
              '#ts': 'Timestamp'
          }
      };

      try {
          const data = await dynamoDB.scan(params).promise();
          const uniqueSensors = new Set();
          const workingSensors = new Set();
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

          data.Items.forEach(item => {
              uniqueSensors.add(item['Sensor ID']);
              const timestamp = new Date(item.Timestamp);
              if (timestamp > tenMinutesAgo) {
                  workingSensors.add(item['Sensor ID']);
              }
          });

          return {
              totalSensors: uniqueSensors.size,
              workingSensors: workingSensors.size
          };
      } catch (error) {
          console.error('Error getting sensor counts:', error);
          throw error;
      }
  }
};