import React, { useState, useEffect } from 'react';
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

const ReportCharts = ({ reportData, sensorIds, temperatureUnit }) => {
  const [chartData, setChartData] = useState({
    temperature: null,
    co2: null,
    pm25: null,
    humidity: null
  });

  // Process the data for charts when report data or temperature unit changes
  useEffect(() => {
    if (!reportData || reportData.length === 0) return;

    // Group data by sensor ID
    const sensorData = {};
    sensorIds.forEach(sensorId => {
      const sensorRecords = reportData.filter(item => item["Sensor ID"] === sensorId.value);
      // Sort records by timestamp
      sensorRecords.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
      sensorData[sensorId.value] = sensorRecords;
    });

    // Create datasets for each metric
    const temperatureChart = createChartData(
      sensorData, 
      'Temperature', 
      temperatureUnit === 'F' ? convertToFahrenheit : val => val,
      temperatureUnit
    );
    
    const co2Chart = createChartData(sensorData, 'CO2');
    const pm25Chart = createChartData(sensorData, 'PM2.5');
    const humidityChart = createChartData(sensorData, 'Humidity');

    setChartData({
      temperature: temperatureChart,
      co2: co2Chart,
      pm25: pm25Chart,
      humidity: humidityChart
    });
  }, [reportData, temperatureUnit, sensorIds]);

  // Helper to convert Celsius to Fahrenheit
  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  // Format date for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }) + ' ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Simplify timestamps for display on x-axis
  const simplifyTimestamps = (timestamps) => {
    if (!timestamps || timestamps.length === 0) return [];
    
    const allDates = timestamps.map(ts => new Date(ts));
    const timeRange = Math.max(...allDates) - Math.min(...allDates);
    const dayRange = timeRange / (1000 * 60 * 60 * 24);
    
    // Function to format timestamp based on date range
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      // If data spans more than 2 days, just show the date
      if (dayRange > 2) {
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        });
      }
      // Otherwise show time
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };
    
    // Reduce number of labels for better readability
    const maxLabels = 10;
    if (timestamps.length <= maxLabels) {
      return timestamps.map(formatTime);
    }
    
    // Skip labels to avoid overcrowding
    const step = Math.ceil(timestamps.length / maxLabels);
    const reducedLabels = timestamps.map((ts, i) => {
      return i % step === 0 ? formatTime(ts) : '';
    });
    
    return reducedLabels;
  };

  // Create chart data configuration for each metric
  const createChartData = (sensorData, metric, transform = val => val, unit = '') => {
    // Get all timestamps from all sensors for this metric and sort them
    const allTimestamps = [];
    Object.values(sensorData).forEach(records => {
      records.forEach(record => {
        if (record.Timestamp && record[metric] !== undefined && record[metric] !== null) {
          allTimestamps.push(record.Timestamp);
        }
      });
    });
    
    // Remove duplicates and sort
    const uniqueTimestamps = [...new Set(allTimestamps)].sort((a, b) => 
      new Date(a) - new Date(b)
    );
    
    const simplifiedLabels = simplifyTimestamps(uniqueTimestamps);
    
    // Create datasets for each sensor
    const datasets = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    let colorIndex = 0;
    Object.entries(sensorData).forEach(([sensorId, records]) => {
      const sensorLabel = sensorIds.find(s => s.value === sensorId)?.label || `Sensor ${sensorId}`;
      
      // Filter out records with undefined metric values and map to values
      const dataPoints = uniqueTimestamps.map(timestamp => {
        const record = records.find(r => r.Timestamp === timestamp);
        return record && record[metric] !== undefined && record[metric] !== null
          ? transform(parseFloat(record[metric]))
          : null;
      });
      
      // Only add dataset if it has at least one non-null value
      if (dataPoints.some(point => point !== null)) {
        datasets.push({
          label: sensorLabel,
          data: dataPoints,
          borderColor: colors[colorIndex % colors.length],
          backgroundColor: `${colors[colorIndex % colors.length]}20`,
          borderWidth: 2,
          pointRadius: dataPoints.length > 20 ? 2 : 3, // Smaller points for dense data
          pointHoverRadius: 5,
          tension: 0.2,
          fill: false
        });
        
        colorIndex++;
      }
    });

    return {
      labels: simplifiedLabels,
      datasets
    };
  };

  // Calculate Y-axis ranges based on data (with padding)
  const getYAxisRange = (chartData, padding = 0.1) => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return { min: null, max: null };
    }
    
    let allValues = [];
    chartData.datasets.forEach(dataset => {
      if (dataset.data && dataset.data.length > 0) {
        allValues = [...allValues, ...dataset.data.filter(val => val !== null)];
      }
    });
    
    if (allValues.length === 0) return { min: null, max: null };
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    
    return { 
      min: min - (range * padding),
      max: max + (range * padding)
    };
  };

  // Generate options for each chart type with improved readability
  const getChartOptions = (title, yAxisLabel, minValue = null, maxValue = null) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300 // Faster animations
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            boxWidth: 12,
            usePointStyle: true,
            padding: 15,
            font: { size: 11 }
          }
        },
        title: {
          display: false // We use a custom title outside the chart
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
          callbacks: {
            title: (tooltipItems) => {
              const dataIndex = tooltipItems[0].dataIndex;
              const dataset = tooltipItems[0].dataset;
              const timestamps = reportData
                .filter(item => item["Sensor ID"] === sensorIds.find(s => 
                  s.label === dataset.label)?.value)
                .sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
              
              if (timestamps[dataIndex]) {
                return formatTimestamp(timestamps[dataIndex].Timestamp);
              }
              return '';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: minValue === null,
          suggestedMin: minValue,
          suggestedMax: maxValue,
          title: {
            display: true,
            text: yAxisLabel,
            font: { size: 12 }
          },
          ticks: {
            font: { size: 10 },
            padding: 5
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time',
            font: { size: 12 }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 10,
            font: { size: 10 }
          },
          grid: {
            display: false
          }
        }
      },
      layout: {
        padding: 10
      }
    };
  };

  if (!chartData.temperature) {
    return <div>No data available for charts</div>;
  }

  // Get Y-axis ranges for each chart
  const tempRange = getYAxisRange(chartData.temperature);
  const co2Range = getYAxisRange(chartData.co2);
  const pm25Range = getYAxisRange(chartData.pm25);
  const humidityRange = getYAxisRange(chartData.humidity);

  return (
    <div className="report-charts">
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-title">Temperature (°{temperatureUnit}) Over Time</div>
          <Line 
            data={chartData.temperature} 
            options={getChartOptions(
              ``, 
              `Temperature (°${temperatureUnit})`,
              tempRange.min,
              tempRange.max
            )} 
            height={200}
          />
        </div>
        
        <div className="chart-container">
          <div className="chart-title">CO2 Levels Over Time</div>
          <Line 
            data={chartData.co2} 
            options={getChartOptions(
              ``, 
              'CO2 (ppm)',
              co2Range.min,
              co2Range.max
            )} 
            height={200}
          />
        </div>
        
        <div className="chart-container">
          <div className="chart-title">PM2.5 Levels Over Time</div>
          <Line 
            data={chartData.pm25} 
            options={getChartOptions(
              ``, 
              'PM2.5 (μg/m³)',
              pm25Range.min,
              pm25Range.max
            )} 
            height={200}
          />
        </div>
        
        <div className="chart-container">
          <div className="chart-title">Humidity Over Time</div>
          <Line 
            data={chartData.humidity} 
            options={getChartOptions(
              ``, 
              'Humidity (%)',
              humidityRange.min,
              humidityRange.max
            )} 
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;