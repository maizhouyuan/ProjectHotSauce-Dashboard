const AWS = require('aws-sdk');

// AWS Configuration
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Initialize DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Helper functions for data processing
const calculateAverage = (values) => {
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length).toFixed(2);
};

const getReportTypeField = (reportType) => {
  switch (reportType.toLowerCase()) {
    case 'temperature': return 'Temperature';
    case 'co2': return 'CO2';
    case 'humidity': return 'Humidity';
    default: throw new Error(`Unsupported report type: ${reportType}`);
  }
};

const getReportTypeUnit = (reportType) => {
  switch (reportType.toLowerCase()) {
    case 'temperature': return '°C';
    case 'co2': return 'ppm';
    case 'humidity': return '%';
    default: return '';
  }
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

module.exports = {
  dynamoDB,
  calculateAverage,
  getReportTypeField,
  getReportTypeUnit,
  generateSummary
};