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
  // Validate input data
  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  // Validate each data point
  const validData = data.filter(item => {
    return (
      item &&
      typeof item.month === 'string' &&
      typeof item.value === 'number' &&
      !isNaN(item.value) &&
      item.value >= 0
    );
  });

  if (validData.length === 0) {
    return <div>No valid data available</div>;
  }

  // List of all months in the range
  const allMonths = [...new Set(validData.map(item => item.month))].sort();

  // Create an object to initialize all months with a default value of 0
  const monthDataMap = {};
  allMonths.forEach(month => {
    monthDataMap[month] = 0;
  });

  // Override the default values with actual data
  validData.forEach(item => {
    if (monthDataMap[item.month] !== undefined) {
      monthDataMap[item.month] = item.value;
    }
  });

  // Extract labels (months) and values (data) for the chart
  const labels = Object.keys(monthDataMap);
  const values = Object.values(monthDataMap);

  // Define threshold values based on CO2 levels
  const thresholds = {
    safe: 450,      // Safe levels
    elevated: 700,  // Slightly elevated
    moderate: 1000, // Moderate level
    high: 2000      // High level
  };

  // Configure the data for the bar chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'CO2 Level (ppm)',
        data: values,
        backgroundColor: values.map(value => {
          if (value <= thresholds.safe) return 'green';
          if (value <= thresholds.elevated) return 'yellowgreen';
          if (value <= thresholds.moderate) return 'yellow';
          if (value <= thresholds.high) return 'orange';
          return 'red';
        }),
      },
    ],
  };

  // Configure the chart options with threshold lines
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Yearly CO2 Levels' },
      annotation: {
        annotations: {
          safeThreshold: {
            type: 'line',
            yMin: thresholds.safe,
            yMax: thresholds.safe,
            borderColor: 'green',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `Safe: ${thresholds.safe} ppm`,
              position: 'end',
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
            },
          },
          elevatedThreshold: {
            type: 'line',
            yMin: thresholds.elevated,
            yMax: thresholds.elevated,
            borderColor: 'yellowgreen',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `Elevated: ${thresholds.elevated} ppm`,
              position: 'end',
              backgroundColor: 'rgba(154, 205, 50, 0.5)',
            },
          },
          moderateThreshold: {
            type: 'line',
            yMin: thresholds.moderate,
            yMax: thresholds.moderate,
            borderColor: 'yellow',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `Moderate: ${thresholds.moderate} ppm`,
              position: 'end',
              backgroundColor: 'rgba(255, 255, 0, 0.5)',
            },
          },
          highThreshold: {
            type: 'line',
            yMin: thresholds.high,
            yMax: thresholds.high,
            borderColor: 'orange',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `High: ${thresholds.high} ppm`,
              position: 'end',
              backgroundColor: 'rgba(255, 165, 0, 0.5)',
            },
          }
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'ppm' },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} ppm`
        }
      },
      x: {
        title: { display: true, text: 'Month' }
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;

