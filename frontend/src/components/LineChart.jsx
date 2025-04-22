import React, { useRef, useEffect } from 'react';
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

const LineChart = ({ data, temperatureUnit }) => {
  const chartRef = useRef(null);

  // Cleanup effect to destroy chart instance when component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return <div>No temperature data available</div>;
  }

  // Format month strings to display nicely
  const formatMonth = (monthStr) => {
    try {
      const [year, month] = monthStr.split('-');
      return `${year}-${month}`;
    } catch (e) {
      return monthStr;
    }
  };

  // Convert temperatures based on the selected unit
  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'F') {
      return (celsius * 9) / 5 + 32;
    }
    return celsius;
  };

  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => a.month.localeCompare(b.month));

  const chartData = {
    labels: sortedData.map(item => formatMonth(item.month)),
    datasets: [
      {
        label: `Monthly Average Temperature (°${temperatureUnit})`,
        data: sortedData.map(item => convertTemperature(item.value)),
        borderColor: 'rgb(75,192,192)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: context => `Temperature: ${context.parsed.y.toFixed(1)}°${temperatureUnit}`,
        },
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `Temperature (°${temperatureUnit})`,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      },
    },
  };

  return <Line data={chartData} options={options} ref={chartRef} id="temperature-line-chart" />;
};

export default LineChart;