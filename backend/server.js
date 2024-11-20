// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

// Initialize AWS SDK and DynamoDB client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Express app setup
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());

// Function to get sensor data from DynamoDB
const getSensorDataFromDynamoDB = async () => {
  const params = {
    TableName: 'Sensors',  // Replace with your DynamoDB table name
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return result.Items;  // Return all items in the table
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    throw error;
  }
};

// Endpoint to fetch sensor data
app.get('/api/data', async (req, res) => {
  try {
    const data = await getSensorDataFromDynamoDB();  // Fetch data from DynamoDB
    res.json(data);  // Return the data to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
