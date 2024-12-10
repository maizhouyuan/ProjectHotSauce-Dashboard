const { dynamoDB, calculateAverage, getReportTypeField, getReportTypeUnit } = require('./dynamodb');

// Dashboard Queries
const getMonthlyAverages = async (year) => {
  try {
    const params = {
      TableName: 'AllDataTest',
      FilterExpression: 'begins_with(#ts, :year)',
      ExpressionAttributeNames: {
        '#ts': 'Timestamp'
      },
      ExpressionAttributeValues: {
        ':year': year.toString()
      }
    };
    const result = await dynamoDB.scan(params).promise();
    
    // Process monthly averages
    const monthlyData = {};
    result.Items.forEach(item => {
      const month = item.Timestamp.substring(0, 7);
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

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      avgTemp: (data.tempSum / data.count).toFixed(2),
      avgCO2: (data.co2Sum / data.count).toFixed(2)
    }));
  } catch (err) {
    console.error('Error getting monthly averages:', err);
    throw err;
  }
};

// Sensor Queries
const getSensorData = async (sensorId) => {
  try {
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
      ScanIndexForward: false
    };
    
    const result = await dynamoDB.query(params).promise();
    return result.Items[0];
  } catch (err) {
    console.error('Error getting sensor data:', err);
    throw err;
  }
};

// Report Queries
const generateReport = async (sensorIds, startTime, endTime) => {
    try {
      const reports = await Promise.all(sensorIds.map(async (sensorId) => {
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
        
        const processedData = result.Items.map(item => {
          const temperature = parseFloat(item[getReportTypeField('temperature')]);
          const co2 = parseFloat(item[getReportTypeField('co2')]);
          const humidity = parseFloat(item[getReportTypeField('humidity')]);
          
          return {
            timestamp: item.Timestamp,
            temperature: {
              value: temperature,
              unit: getReportTypeUnit('temperature')
            },
            co2: {
              value: co2,
              unit: getReportTypeUnit('co2')
            },
            humidity: {
              value: humidity,
              unit: getReportTypeUnit('humidity')
            },
            pm25: item.PM25
          };
        });
  
        const temperatures = processedData.map(d => d.temperature.value);
        const co2Values = processedData.map(d => d.co2.value);
        const humidityValues = processedData.map(d => d.humidity.value);
  
        return {
          sensorId,
          data: processedData,
          averages: {
            temperature: calculateAverage(temperatures),
            co2: calculateAverage(co2Values),
            humidity: calculateAverage(humidityValues)
          }
        };
      }));
  
      return {
        reports,
        dateRange: `${startTime} - ${endTime}`
      };
    } catch (err) {
      console.error('Error generating report:', err);
      throw err;
    }
  };
  
  module.exports = {
    getMonthlyAverages,
    getSensorData,
    generateReport
  };