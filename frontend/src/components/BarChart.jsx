// components/BarChart.jsx
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'CO2 Level',
      data: [450, 600, 600, 700, 700, 1000, 5000, 2000, 700, 700, 500, 400],
      backgroundColor: (context) => {
        const value = context.raw;
        if (value <= 450) return 'green';
        if (value <= 700) return 'yellowgreen';
        if (value <= 1000) return 'yellow';
        if (value <= 2000) return 'orange';
        return 'red';
      }
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'CO2 Level'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'ppm'
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;