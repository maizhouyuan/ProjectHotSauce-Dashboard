const axios = require('axios');

// Open-Meteo API base URL
const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

// Fetch daily temperature data and calculate monthly averages
const getMonthlyAverageTemperature = async (latitude, longitude, startDate, endDate) => {
  try {
    // Request daily temperature data from Open-Meteo API
    const response = await axios.get(BASE_URL, {
      params: {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        daily: 'temperature_2m_mean',
        timezone: 'auto',
      },
    });

    const { time, temperature_2m_mean } = response.data.daily;

    // Aggregate daily data into monthly averages
    const monthlyData = aggregateMonthlyData(time, temperature_2m_mean);

    return monthlyData;
  } catch (error) {
    console.error('Error fetching daily data from Open-Meteo:', error);
    throw error;
  }
};

// Helper function to group daily data by month and calculate averages
const aggregateMonthlyData = (timeArray, temperatureArray) => {
  const monthlyData = {};

  timeArray.forEach((date, index) => {
    const month = date.slice(0, 7); // Extract year and month (e.g., "2023-01")
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(temperatureArray[index]);
  });

  // Calculate the average temperature for each month
  return Object.entries(monthlyData).map(([month, temps]) => ({
    month,
    avgTemperature: (temps.reduce((sum, temp) => sum + temp, 0) / temps.length).toFixed(1), // Keep one decimal place
  }));
};

module.exports = { getMonthlyAverageTemperature };
