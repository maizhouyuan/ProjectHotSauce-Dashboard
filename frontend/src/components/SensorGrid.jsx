import React, { useState, useEffect, useRef } from 'react';
import '../styles/SensorGrid.css';

const SensorGrid = ({ onSensorClick, temperatureUnit, onTemperatureUnitChange }) => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping of sensor IDs to display numbers
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

  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'F') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

  const formatTemperature = (celsius) => {
    if (celsius === null) return 'N/A';
    const temp = convertTemperature(celsius);
    return `${temp.toFixed(1)}°${temperatureUnit}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        console.log('Starting to fetch sensors...');
        const response = await fetch('/api/sensors');
        if (!response.ok) {
          throw new Error('Failed to fetch sensors');
        }
        const data = await response.json();
        // 更新传感器名称
        const updatedData = data.map(sensor => {
          if (sensor.id === 'fcf5c497654a') {
            return { ...sensor, name: 'Event Space' };
          }
          if (sensor.id === '40f52032b5b7') {
            return { ...sensor, name: 'Cube Garden' };
          }
          return sensor;
        });
        setSensors(updatedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sensors:', err);
        setError('Failed to fetch sensors');
        setLoading(false);
      }
    };

    fetchSensors();
  }, []);

  const sensorsByFloor = sensors.reduce((acc, sensor) => {
    const floor = sensor.floor;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(sensor);
    return acc;
  }, {});

  const floorOrder = ['4', '3', '2', '1', 'external'];

  const handleSensorClick = (sensor) => {
    if (onSensorClick) {
      onSensorClick(sensor);
    }
  };

  return (
    <div className="sensor-grid">
      <div className="header-container">
        <div className="temperature-unit-toggle">
          <button 
            className={`unit-button ${temperatureUnit === 'F' ? 'active' : ''}`}
            onClick={() => onTemperatureUnitChange('F')}
          >
            °F
          </button>
          <button 
            className={`unit-button ${temperatureUnit === 'C' ? 'active' : ''}`}
            onClick={() => onTemperatureUnitChange('C')}
          >
            °C
          </button>
        </div>
      </div>
      {loading && <div className="loading">Loading sensors...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <div className="floors-container">
          {floorOrder.map(floor => {
            const floorSensors = sensorsByFloor[floor] || [];
            if (floorSensors.length === 0) return null;
            
            return (
              <div key={floor} className="floor-section">
                <h2>Floor {floor}</h2>
                <div className="sensors-container">
                  {floorSensors.map(sensor => (
                    <div
                      key={sensor.id}
                      className="sensor-card"
                      data-status={sensor.status}
                      onClick={() => handleSensorClick(sensor)}
                    >
                      <div className={`status-indicator ${sensor.status}`}>
                        {sensor.status}
                      </div>
                      <h3>Sensor {sensorNumberMapping[sensor.id] || 'N/A'} - {sensor.name}</h3>
                      {sensor.lastReading && (
                        <>
                          <div className="data-point">
                            <span className="label">Temperature:</span>
                            <span className="value">{formatTemperature(sensor.lastReading.temperature)}</span>
                          </div>
                          <div className="data-point">
                            <span className="label">Humidity:</span>
                            <span className="value">{sensor.lastReading.humidity !== null ? `${sensor.lastReading.humidity}%` : 'N/A'}</span>
                          </div>
                          <div className="data-point">
                            <span className="label">CO2:</span>
                            <span className="value">{sensor.lastReading.co2 !== null ? `${sensor.lastReading.co2} ppm` : 'N/A'}</span>
                          </div>
                          <div className="data-point">
                            <span className="label">PM2.5:</span>
                            <span className="value">{sensor.lastReading.pm25 !== null ? `${sensor.lastReading.pm25} µg/m³` : 'N/A'}</span>
                          </div>
                          <div className="data-point timestamp">
                            <span className="label">Last Updated:</span>
                            <span className="value">{formatTimestamp(sensor.lastReading.timestamp)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SensorGrid;