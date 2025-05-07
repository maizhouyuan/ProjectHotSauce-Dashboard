import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import MonthlyTemperatureChart from '../components/MonthlyTemperatureChart';
import CO2Chart from '../components/CO2Chart';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [co2Data, setCo2Data] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    temperature: null,
    pm25: null,
    co2: null,
    humidity: null,
    timestamp: null
  });
  const [sensorCounts, setSensorCounts] = useState({
    total: 0,
    working: 0
  });
  const [temperatureUnit, setTemperatureUnit] = useState('F');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sensor ID for Courtyard sensor
  const courtyardSensorId = 'd8bfc0c0e514';

  // Sensor mapping from SensorGrid.jsx
  const sensorNumberMapping = {
    'bcff4dd3b24c': '2',  // Hope Classroom
    'fcf5c497654a': '3',  // Event Space
    'bcff4dd3b442': '4',  // 220 Classroom
    'd8bfc0c0e514': '5',  // Outdoor underneath stairs
    'a4cf12ff89ae': '6',  // 216 Classroom
    '40f52032b5b7': '7',  // Cube Garden
    '08f9e05fd2d3': '8',  // Room 210
    '485519ee6c1a': '9',  // Lounge space
    '485519ee5010': '10', // Study space
    '2462ab14bae1': '11', // Room 307 / Whidbey
    '98f4abd6f8fa': '12', // Room 402
    '18fe34f753d2': '13'  // Room 416
  };

  // Get current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Fetch sensor data and CO2 readings
  const fetchAllSensorData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all sensors to get active status
      const sensorsResponse = await fetch('/api/sensors');
      
      if (!sensorsResponse.ok) {
        throw new Error(`Sensors API error: ${sensorsResponse.status}`);
      }
      
      const sensorsData = await sensorsResponse.json();
      console.log('Sensors API response:', sensorsData);
      
      // Count active sensors
      const activeSensors = sensorsData.filter(sensor => sensor.status === 'active');
      const totalSensors = sensorsData.length;
      
      setSensorCounts({
        total: totalSensors,
        working: activeSensors.length
      });
      
      // Extract CO2 data from all sensors
      const co2Values = sensorsData
        .filter(sensor => sensor.lastReading && sensor.lastReading.co2 !== null)
        .map(sensor => {
          return {
            sensorId: sensor.id,
            location: sensor.name || 'Unknown',
            co2: sensor.lastReading.co2,
            status: sensor.status
          };
        });
      
      // Sort by CO2 level (highest first)
      co2Values.sort((a, b) => b.co2 - a.co2);
      
      setCo2Data(co2Values);
      
      // Get Courtyard sensor data specifically for the cards
      const courtyardSensor = sensorsData.find(sensor => sensor.id === courtyardSensorId);
      
      if (courtyardSensor && courtyardSensor.lastReading) {
        setRealTimeData({
          temperature: courtyardSensor.lastReading.temperature,
          co2: courtyardSensor.lastReading.co2,
          pm25: courtyardSensor.lastReading.pm25,
          humidity: courtyardSensor.lastReading.humidity,
          timestamp: courtyardSensor.lastReading.timestamp
        });
      } else {
        console.warn('Courtyard sensor data not found in API response');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchAllSensorData();
    
    // Set up polling for real-time updates (every 1 minute)
    const pollInterval = setInterval(fetchAllSensorData, 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  }, []);
  
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={() => fetchAllSensorData()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="temperature-unit-toggle">
        <button 
          className={`unit-button ${temperatureUnit === 'F' ? 'active' : ''}`}
          onClick={() => setTemperatureUnit('F')}
        >
          °F
        </button>
        <button 
          className={`unit-button ${temperatureUnit === 'C' ? 'active' : ''}`}
          onClick={() => setTemperatureUnit('C')}
        >
          °C
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="chart-section">
          <div className="chart-container temperature-chart-container">
            <h3>Monthly Temperature Trends ({currentYear})</h3>
            <MonthlyTemperatureChart temperatureUnit={temperatureUnit} />
          </div>

          <div className="chart-container co2-chart-container">
            <CO2Chart co2Data={co2Data} />
          </div>
        </div>

        <div className="cards-section">
          <DashboardCards
            temperature={realTimeData.temperature}
            pm25={realTimeData.pm25}
            co2={realTimeData.co2}
            humidity={realTimeData.humidity}
            timestamp={realTimeData.timestamp}
            totalSensors={sensorCounts.total}
            workingSensors={sensorCounts.working}
            temperatureUnit={temperatureUnit}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;