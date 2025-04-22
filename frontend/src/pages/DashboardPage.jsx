import React, { useState, useEffect } from 'react';
import DashboardCards from '../components/DashboardCards';
import MonthlyTemperatureChart from '../components/MonthlyTemperatureChart';
import '../styles/DashboardPage.css';
import CO2Chart from '../components/CO2Chart';

const DashboardPage = () => {
  const [co2Data, setCo2Data] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    temperature: null,
    pm25: null,
    co2: null
  });
  const [sensorCounts, setSensorCounts] = useState({
    total: 0,
    working: 0
  });
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sensor mapping
  const sensorMapping = {
    'bcff4dd3b24c': { number: '2', location: 'Room 110' },
    'fcf5c497654a': { number: '3', location: 'Main Event Space' },
    'bcff4dd3b442': { number: '4', location: 'Room 220' },
    'd8bfc0c0e514': { number: '5', location: 'Courtyard' },
    'a4cf12ff89ae': { number: '6', location: 'Room 216' },
    '40f52032b5b7': { number: '7', location: 'Staff Workspace' },
    '08f9e05fd2d3': { number: '8', location: 'Room 210' },
    '485519ee6c1a': { number: '9', location: 'Lounge Space' },
    '485519ee5010': { number: '10', location: 'Study Space' },
    '2462ab14bae1': { number: '11', location: 'Room 307' },
    '98f4abd6f8fa': { number: '12', location: 'Room 402' },
    '18fe34f753d2': { number: '13', location: 'Room 416' }
  };
  
  // Get current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // First try to get data for CO2 bars
        try {
          const response = await fetch('/api/homepage/data');
          
          if (response.ok) {
            const data = await response.json();
            console.log('Dashboard API response:', data);
            
            if (data && data.sensors && data.sensors.length > 0) {
              // Get CO2 data for working sensors
              const workingSensors = data.sensors.filter(sensor => {
                return sensor.realTimeData && 
                      sensor.realTimeData.co2 !== null && 
                      sensor.realTimeData.co2 !== undefined;
              });
              
              const co2Values = workingSensors.map(sensor => {
                const sensorInfo = sensorMapping[sensor.sensorId] || 
                                  { number: sensor.sensorId, location: 'Unknown' };
                
                return {
                  sensorId: sensor.sensorId,
                  number: sensorInfo.number,
                  location: sensorInfo.location,
                  label: `Sensor ${sensorInfo.number} - ${sensorInfo.location}`,
                  co2: sensor.realTimeData.co2
                };
              });
              
              setCo2Data(co2Values);
              
              // Set sensor counts
              setSensorCounts({
                total: data.sensorCounts?.total || data.sensors.length,
                working: data.sensorCounts?.working || workingSensors.length
              });
            }
          } else {
            console.error('API error status:', response.status);
            throw new Error('Failed to fetch data from API');
          }
        } catch (apiError) {
          console.error('API fetch error:', apiError);
          
          // Use demo data if API fails for charts
          setCo2Data([
            { sensorId: 'bcff4dd3b24c', number: '2', location: 'Room 110', label: 'Sensor 2 - Room 110', co2: 410 },
            { sensorId: 'fcf5c497654a', number: '3', location: 'Main Event Space', label: 'Sensor 3 - Main Event Space', co2: 620 }
          ]);
          
          setSensorCounts({
            total: 12,
            working: 2
          });
        }
        
        // Now fetch direct data for Courtyard sensor for cards
        try {
          // Directly fetch Courtyard sensor data
          const courtyardSensorId = 'd8bfc0c0e514';
          const response = await fetch(`/api/sensors/${courtyardSensorId}`);
          
          if (response.ok) {
            const sensorData = await response.json();
            console.log('Courtyard sensor data:', sensorData);
            
            if (sensorData && sensorData.lastReading) {
              // Update real-time data with courtyard sensor readings
              setRealTimeData({
                temperature: sensorData.lastReading.temperature,
                co2: sensorData.lastReading.co2,
                pm25: sensorData.lastReading.pm25
              });
            } else {
              console.warn('Courtyard sensor data is missing or lastReading is undefined');
              throw new Error('Invalid courtyard sensor data');
            }
          } else {
            console.error('Failed to fetch courtyard sensor data');
            throw new Error('API error for courtyard sensor');
          }
        } catch (courtyardError) {
          console.error('Error fetching courtyard sensor data:', courtyardError);
          
          // Fallback to demo data if we can't get courtyard sensor data
          setRealTimeData({
            temperature: 24.5,
            co2: 410,
            pm25: 15.8
          });
        }
        
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // Poll for updates every 10 minutes
    const pollInterval = setInterval(fetchDashboardData, 10 * 60 * 1000);
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
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Environmental Monitoring Dashboard</h2>
        <div className="temperature-unit-toggle">
          <button 
            className={`unit-button ${temperatureUnit === 'C' ? 'active' : ''}`}
            onClick={() => setTemperatureUnit('C')}
          >
            Celsius (°C)
          </button>
          <button 
            className={`unit-button ${temperatureUnit === 'F' ? 'active' : ''}`}
            onClick={() => setTemperatureUnit('F')}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-section">
          <div className="chart-container">
            <h3>Monthly Temperature Trends ({currentYear})</h3>
            <MonthlyTemperatureChart temperatureUnit={temperatureUnit} />
          </div>

          <div className="chart-container">
            <h3>CO2 Levels by Location</h3>
            {co2Data.length > 0 ? (
              <CO2Chart co2Data={co2Data} />
            ) : (
              <div className="chart-empty">No CO2 data available</div>
            )}
          </div>
        </div>

        <div className="cards-section">
          <DashboardCards
            temperature={realTimeData.temperature}
            pm25={realTimeData.pm25}
            co2={realTimeData.co2}
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