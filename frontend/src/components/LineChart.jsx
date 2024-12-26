import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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

const LineChart = ({ data }) => {
  const [unit, setUnit] = useState('C'); // Manage unit state locally in the chart

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Convert temperatures based on the selected unit
  const convertedData = data.map(item => ({
    ...item,
    avgTemperature:
      unit === 'C'
        ? item.avgTemperature // Keep as Celsius
        : (item.avgTemperature * 9) / 5 + 32, // Convert to Fahrenheit
  }));

  const chartData = {
    labels: convertedData.map(item => item.month), // X-axis: Months
    datasets: [
      {
        label: `Monthly Average Temperature (°${unit})`,
        data: convertedData.map(item => item.avgTemperature), // Y-axis: Temperatures
        borderColor: 'rgb(75,192,192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Temperature Trends' },
      tooltip: {
        callbacks: {
          label: context => `Temperature: ${context.parsed.y}°${unit}`, // Show unit in tooltip
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: { display: true, text: `Temperature (°${unit})` }, // Show unit in Y-axis label
      },
      x: { title: { display: true, text: 'Month' } },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Toggle Buttons */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button 
          onClick={() => setUnit('C')} 
          disabled={unit === 'C'}
          style={{ marginRight: '10px', padding: '5px', cursor: unit === 'C' ? 'not-allowed' : 'pointer' }}
        >
          Celsius (°C)
        </button>
        <button 
          onClick={() => setUnit('F')} 
          disabled={unit === 'F'}
          style={{ padding: '5px', cursor: unit === 'F' ? 'not-allowed' : 'pointer' }}
        >
          Fahrenheit (°F)
        </button>
      </div>

      {/* Line Chart */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
