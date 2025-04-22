import React, { useState, useEffect } from 'react';
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

// Import the annotation plugin for threshold lines
import annotationPlugin from 'chartjs-plugin-annotation';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define CO2 thresholds
  const thresholds = {
    safe: 450,      // Safe levels
    elevated: 700,  // Elevated level
    moderate: 1000, // Moderate level
    high: 2000      // High level
  };

  // Process the data when it changes
  useEffect(() => {
    if (!data) {
      setError('No data available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      let chartLabels = [];
      let chartValues = [];
      let barColors = [];
      
      // Check if we have direct CO2 data from sensors
      if (data.co2Data && data.co2Data.length > 0) {
        // Use the provided CO2 data array
        chartLabels = data.co2Data.map(item => item.sensorId);
        chartValues = data.co2Data.map(item => item.co2);
        
        // Generate colors based on CO2 levels
        barColors = chartValues.map(value => {
          if (value === null || value === undefined) return 'rgba(200, 200, 200, 0.5)';
          if (value <= thresholds.safe) return '#4CAF50'; // Green
          if (value <= thresholds.elevated) return '#8BC34A'; // Light Green
          if (value <= thresholds.moderate) return '#FFC107'; // Yellow
          if (value <= thresholds.high) return '#FF9800'; // Orange
          return '#F44336'; // Red
        });
      } else {
        // Fallback to the old method using sensor count and real-time data
        const totalSensors = data.sensorCounts?.total || 0;
        
        // Create labels for all sensors
        chartLabels = Array.from({ length: Math.max(1, totalSensors) }, (_, i) => 
          (i + 1).toString().padStart(3, '0')
        );
        
        // Create data array with CO2 values
        chartValues = chartLabels.map((_, index) => {
          if (index === 0 && data.realTimeData && data.realTimeData.co2 !== undefined) {
            return data.realTimeData.co2;
          }
          return null; // No data for other sensors
        });
        
        // Generate bar colors based on CO2 thresholds
        barColors = chartValues.map(value => {
          if (value === null || value === undefined) return 'rgba(200, 200, 200, 0.5)';
          if (value <= thresholds.safe) return '#4CAF50'; // Green
          if (value <= thresholds.elevated) return '#8BC34A'; // Light Green
          if (value <= thresholds.moderate) return '#FFC107'; // Yellow
          if (value <= thresholds.high) return '#FF9800'; // Orange
          return '#F44336'; // Red
        });
      }
      
      // Create the chart data object
      const processedData = {
        labels: chartLabels,
        datasets: [{
          label: 'CO2 Level (ppm)',
          data: chartValues,
          backgroundColor: barColors,
          borderColor: barColors.map(color => color.replace('0.5', '0.8')),
          borderWidth: 1
        }]
      };

      setChartData(processedData);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error processing chart data:', error);
      setError('Failed to process data');
      setIsLoading(false);
    }
  }, [data]);

  // Configure the chart options with threshold lines
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            if (value === null || value === undefined) return 'No data available';
            return `CO2: ${value} ppm`;
          }
        }
      },
      annotation: {
        annotations: {
          safeThreshold: {
            type: 'line',
            yMin: thresholds.safe,
            yMax: thresholds.safe,
            borderColor: '#4CAF50',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: false
            },
          },
          elevatedThreshold: {
            type: 'line',
            yMin: thresholds.elevated,
            yMax: thresholds.elevated,
            borderColor: '#8BC34A',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: false
            },
          },
          moderateThreshold: {
            type: 'line',
            yMin: thresholds.moderate,
            yMax: thresholds.moderate,
            borderColor: '#FFC107',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: false
            },
          },
          highThreshold: {
            type: 'line',
            yMin: thresholds.high,
            yMax: thresholds.high,
            borderColor: '#FF9800',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              display: false
            },
          }
        },
      },
    },
    scales: {
      y: {
        title: { 
          display: true, 
          text: 'CO2 Level (ppm)',
          font: {
            size: 12
          }
        },
        beginAtZero: true,
        suggestedMax: 2000,
        ticks: {
          callback: value => `${value} ppm`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: { 
          display: true, 
          text: 'Sensor ID',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    },
  };

  if (error) return <div className="error">{error}</div>;
  if (isLoading) return <div>Loading sensor data...</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <Bar data={chartData} options={options} />
  );
};

export default BarChart;