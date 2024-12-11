import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data = [] }) => {
  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <div>Loading temperature data...</div>;
  }

  const chartData = {
    // X-axis: months
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Average Temperature (°C)',
        // Y-axis: temperature values
        data: data.map(item => item.avgTemperature),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Temperature Trends'
      },
      tooltip: {
        callbacks: {
          label: (context) => `Temperature: ${context.parsed.y}°C`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
