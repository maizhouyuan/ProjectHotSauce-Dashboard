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

// Import the annotation plugin for threshold line
import annotationPlugin from 'chartjs-plugin-annotation';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define all sensors (matching SensorGrid)
  const allSensors = Array.from({ length: 14 }, (_, i) => ({
    id: i + 1,
    name: `Sensor ${i + 1}`,
    status: i === 13 ? 'error' : 'active' // Sensor 14 is in error state
  }));

  // Process the data when it changes
  useEffect(() => {
    if (!data || !data.realTimeData || !data.sensorCounts) {
      setError('No data available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Create data for actual sensors
      const totalSensors = data.sensorCounts.total || 0;
      const sensorData = {};
      
      // Initialize actual sensors with 0
      for (let i = 1; i <= totalSensors; i++) {
        const sensorId = `sensor-${i.toString().padStart(3, '0')}`;
        sensorData[sensorId] = 0; // Default value
      }

      // Update with actual value for sensor-001
      if (data.realTimeData.co2) {
        sensorData['sensor-001'] = data.realTimeData.co2;
      }

      // Process the data for the chart
      const processedData = {
        labels: Object.keys(sensorData).map(id => id.split('-')[1]), // Show just the number part
        datasets: [{
          label: 'CO2 Level (ppm)',
          data: Object.values(sensorData),
          backgroundColor: Object.values(sensorData).map(value => {
            if (value <= 450) return 'green';
            if (value <= 700) return 'yellowgreen';
            if (value <= 1000) return '#FFD700';
            if (value <= 2000) return 'orange';
            return 'red';
          }),
        }]
      };

      setChartData(processedData);
    } catch (error) {
      console.error('Error processing chart data:', error);
      setError('Failed to process data');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  // Define threshold values based on CO2 levels
  const thresholds = {
    safe: 450,      // Safe levels
    elevated: 700,  // Slightly elevated
    moderate: 1000, // Moderate level
    high: 2000      // High level
  };

  // Configure the chart options with threshold lines
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'CO2 Levels by Sensor' },
      annotation: {
        annotations: {
          safeThreshold: {
            type: 'line',
            yMin: thresholds.safe,
            yMax: thresholds.safe,
            borderColor: 'green',
            borderWidth: 3,
            borderDash: [5, 5],
            label: {
              display: false
            },
          },
          elevatedThreshold: {
            type: 'line',
            yMin: thresholds.elevated,
            yMax: thresholds.elevated,
            borderColor: 'yellowgreen',
            borderWidth: 3,
            borderDash: [5, 5],
            label: {
              display: false
            },
          },
          moderateThreshold: {
            type: 'line',
            yMin: thresholds.moderate,
            yMax: thresholds.moderate,
            borderColor: '#FFD700',
            borderWidth: 3,
            borderDash: [5, 5],
            label: {
              display: false
            },
          },
          highThreshold: {
            type: 'line',
            yMin: thresholds.high,
            yMax: thresholds.high,
            borderColor: 'orange',
            borderWidth: 3,
            borderDash: [5, 5],
            label: {
              display: false
            },
          }
        },
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'CO2 Level (ppm)' },
        beginAtZero: true,
        ticks: {
          callback: value => `${value} ppm`
        }
      },
      x: {
        title: { display: true, text: 'Sensor ID' }
      }
    },
  };

  if (error) return <div className="error">{error}</div>;
  if (isLoading) return <div>Loading sensor data...</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 3 }}>
        <Bar data={chartData} options={options} />
      </div>
      <div style={{ 
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        minWidth: '120px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ color: 'green', fontWeight: 'bold', fontSize: '12px' }}>
          Safe: {thresholds.safe} ppm
        </div>
        <div style={{ color: 'yellowgreen', fontWeight: 'bold', fontSize: '12px' }}>
          Elevated: {thresholds.elevated} ppm
        </div>
        <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '12px' }}>
          Moderate: {thresholds.moderate} ppm
        </div>
        <div style={{ color: 'orange', fontWeight: 'bold', fontSize: '12px' }}>
          High: {thresholds.high} ppm
        </div>
      </div>
    </div>
  );
};

export default BarChart;

