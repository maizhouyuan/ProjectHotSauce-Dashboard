import React from 'react';
import '../styles/DashboardCards.css';

const DashboardCards = ({ 
  temperature, 
  pm25, 
  co2, 
  humidity, 
  timestamp, 
  totalSensors, 
  workingSensors, 
  temperatureUnit 
}) => {
  // Convert Celsius to Fahrenheit if needed
  const displayTemperature = temperatureUnit === 'F' && temperature !== null 
    ? ((temperature * 9/5) + 32).toFixed(1) 
    : temperature !== null ? temperature.toFixed(1) : 'N/A';

  // Define CO2 thresholds
  const co2Thresholds = {
    safe: 450,      // Safe levels
    elevated: 700,  // Slightly elevated
    moderate: 1000, // Moderate level
    high: 2000      // High level
  };

  // Get CO2 status based on value
  const getCo2Status = (value) => {
    if (!value && value !== 0) return { status: 'N/A', color: '#666', label: 'N/A' };
    if (value <= co2Thresholds.safe) return { status: 'safe', color: '#4CAF50', label: 'Safe' };
    if (value <= co2Thresholds.elevated) return { status: 'elevated', color: '#8BC34A', label: 'Elevated' };
    if (value <= co2Thresholds.moderate) return { status: 'moderate', color: '#FFC107', label: 'Moderate' };
    if (value <= co2Thresholds.high) return { status: 'high', color: '#FF9800', label: 'High' };
    return { status: 'very-high', color: '#F44336', label: 'Very High' };
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Not Available';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const co2Status = getCo2Status(co2);
  const lastUpdated = formatTimestamp(timestamp);

  return (
    <div className="dashboard-cards">
      {/* Temperature Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Current Temperature (Courtyard)</h3>
          <div className="card-icon temperature-icon">🌡️</div>
        </div>
        <div className="card-content">
          <div className="current-value">{displayTemperature} °{temperatureUnit}</div>
          {humidity !== null && humidity !== undefined && (
            <div className="additional-info">Humidity: {humidity}%</div>
          )}
        </div>
      </div>

      {/* CO2 Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Current CO2 Level (Courtyard)</h3>
          <div className="card-icon co2-icon">🌫️</div>
        </div>
        <div className="card-content">
          <div className="current-value" style={{ color: co2Status.color }}>
            {co2 !== undefined && co2 !== null ? `${co2} ppm` : 'N/A'}
          </div>
          <div className="status-indicator" style={{ backgroundColor: co2Status.color }}>
            {co2Status.label}
          </div>
        </div>
      </div>

      {/* PM2.5 Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Current PM2.5 (Courtyard)</h3>
          <div className="card-icon pm25-icon">💨</div>
        </div>
        <div className="card-content">
          <div className="current-value">
            {pm25 !== undefined && pm25 !== null ? `${pm25} µg/m³` : 'N/A'}
          </div>
          <div className="last-updated">
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Sensor Status Card */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Sensor Status</h3>
          <div className="card-icon sensor-icon">📊</div>
        </div>
        <div className="card-content">
          <div className="status-text">
            Working: <span className="highlight">{workingSensors || 0}</span> / Total: <span className="highlight">{totalSensors || 0}</span>
          </div>
          <div className="sensor-status-bar">
            <div 
              className="sensor-status-progress" 
              style={{ 
                width: totalSensors ? `${(workingSensors / totalSensors) * 100}%` : '0%',
                backgroundColor: workingSensors === totalSensors ? '#4CAF50' : 
                  (workingSensors >= totalSensors * 0.75) ? '#8BC34A' :
                  (workingSensors >= totalSensors * 0.5) ? '#FFC107' : '#F44336'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;