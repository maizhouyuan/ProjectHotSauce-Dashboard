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

//ADDED
// Import the annotation plugin for threshold line
import annotationPlugin from 'chartjs-plugin-annotation';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const BarChart = ({ data }) => {
  // List of all months in the range
  // fixing hard-coded month
  const allMonths = [...new Set(data.map(item => item.month))];

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

  // ADDED: Example threshold
  // Define threshold value
  const threshold = 0.5;

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

  // Configure the chart options with threshold line
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }, // Place the legend at the top
      title: { display: true, text: 'Yearly CO2 Levels' }, // Chart title

      //add the threshold line
      annotation: {
        annotations: {
          line1: { // ADDED: Horizontal threshold line
            type: 'line',
            yMin: threshold,
            yMax: threshold,
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5], // Makes it dashed
            label: {
              display: true,
              content: `Threshold: ${threshold} ppm`,
              //label displayed at the end of the line
              position: 'end',
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
            },
          },
        },
      },
    },
    scales: {
      y: { title: { display: true, text: 'ppm' } }, // Label for the y-axis
    },
  };

  // Render the bar chart with the data and options
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
