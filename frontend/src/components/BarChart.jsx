import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  // List of all months in the range
  // THIS SHOULDN'T BE HARDCODED, FIX IT!
  const allMonths = [
    '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11',
    '2024-12', // Mid-year months
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'
  ];

  // Create an object to initialize all months with a default value of 0
  const monthDataMap = {};
  allMonths.forEach(month => {
    monthDataMap[month] = 0;
  });

  // Override the default values with actual data
  data.forEach(item => {
    if (monthDataMap[item.month] !== undefined) {
      monthDataMap[item.month] = item.value;
    }
  });

  // Extract labels (months) and values (data) for the chart
  const labels = Object.keys(monthDataMap);
  const values = Object.values(monthDataMap);

  // Configure the data for the bar chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'CO2 Level (ppm)',
        data: values,
        backgroundColor: values.map(value => {
          if (value <= 450) return 'green'; // Safe levels
          if (value <= 700) return 'yellowgreen'; // Slightly elevated
          if (value <= 1000) return 'yellow'; // Moderate level
          if (value <= 2000) return 'orange'; // High level
          return 'red'; // Very high level
        }),
      },
    ],
  };

  // Configure the chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }, // Place the legend at the top
      title: { display: true, text: 'Yearly CO2 Levels' }, // Chart title
    },
    scales: {
      y: { title: { display: true, text: 'ppm' } }, // Label for the y-axis
    },
  };

  // Render the bar chart with the data and options
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
