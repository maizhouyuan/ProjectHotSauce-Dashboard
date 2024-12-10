// components/LineChart.jsx
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

const LineChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Temperature 2024',
        data: [15, 17, 16, 14, 10, 17, 15, 14, 16, 15, 14, 15],
        borderColor: 'rgb(255, 99, 71)',
        tension: 0.4
      },
      {
        label: 'Temperature 2023',
        data: [8, 12, 12, 12, 6, 13, 12, 11, 12, 10, 9, 10],
        borderColor: 'rgb(255, 165, 0)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Temperature'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 25,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default LineChart;