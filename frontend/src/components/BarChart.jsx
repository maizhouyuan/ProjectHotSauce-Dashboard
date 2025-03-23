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
  const [selectedSensor, setSelectedSensor] = useState('sensor-001'); // Default sensor
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate sensor options based on the total count
  const generateSensorOptions = () => {
    const totalSensors = data?.sensorCounts?.total || 10; // Default to 10 if not provided
    return Array.from({ length: totalSensors }, (_, i) => {
      const sensorNumber = (i + 1).toString().padStart(3, '0');
      return `sensor-${sensorNumber}`;
    });
  };

  // Process the data when it changes
  useEffect(() => {
    if (!data || !data.yearlyData || !data.yearlyData.co2) {
      setError('No data available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Process the data for the chart
      const processedData = {
        labels: data.yearlyData.co2.map(item => item.month.substring(5)), // Get just the month part (MM)
        datasets: [{
          label: `CO2 Level (ppm) - ${selectedSensor}`,
          data: data.yearlyData.co2.map(item => item.value),
          backgroundColor: data.yearlyData.co2.map(item => {
            if (item.value <= 450) return 'green';
            if (item.value <= 700) return 'yellowgreen';
            if (item.value <= 1000) return 'yellow';
            if (item.value <= 2000) return 'orange';
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
  }, [data, selectedSensor]);

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
      title: { display: true, text: 'Monthly CO2 Levels' },
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
            borderColor: 'yellow',
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

  if (error) return <div className="error">{error}</div>;
  if (isLoading) return <div>Loading sensor data...</div>;
  if (!chartData) return <div>No data available</div>;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 3 }}>
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <select 
            value={selectedSensor} 
            onChange={(e) => setSelectedSensor(e.target.value)}
            style={{
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
          >
            {generateSensorOptions().map(sensorId => (
              <option key={sensorId} value={sensorId}>
                Sensor {sensorId.split('-')[1]}
              </option>
            ))}
          </select>
        </div>
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
        <div style={{ color: 'yellow', fontWeight: 'bold', fontSize: '12px' }}>
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

