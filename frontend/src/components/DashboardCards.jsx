import React from 'react';
import '../styles/DashboardCards.css';

const DashboardCards = ({ temperature, pm25, co2, totalSensors, workingSensors }) => {
  console.log('DashboardCards received CO2 value:', co2);

  // Define CO2 thresholds
  const co2Thresholds = {
    safe: 450,
    elevated: 700,
    moderate: 1000,
    high: 2000
  };

  // Get CO2 status and color
  const getCo2Status = (value) => {
    console.log('Getting CO2 status for value:', value);
    if (!value) return { status: 'N/A', color: '#666' };
    if (value <= co2Thresholds.safe) return { status: 'Safe', color: '#4CAF50' };
    if (value <= co2Thresholds.elevated) return { status: 'Elevated', color: '#8BC34A' };
    if (value <= co2Thresholds.moderate) return { status: 'Moderate', color: '#FFC107' };
    if (value <= co2Thresholds.high) return { status: 'High', color: '#FF9800' };
    return { status: 'Very High', color: '#F44336' };
  };

  const co2Status = getCo2Status(co2);

  return (
    <div className="dashboard-cards">
      {/* Temperature Card */}
      <div className="card">
        <div className="card-icon">🌡️</div>
        <div className="card-content">
          <h3>Current Temperature</h3>
          <p className="card-value">{temperature !== undefined ? `${temperature} °C` : 'N/A'}</p>
        </div>
      </div>

      {/* CO2 Card */}
      <div className="card">
        <div className="card-icon">🌫️</div>
        <div className="card-content">
          <h3>Current CO2 Level</h3>
          <p className="card-value" style={{ color: co2Status.color }}>
            {co2 !== undefined ? `${co2} ppm` : 'N/A'}
          </p>
          <p className="card-status" style={{ color: co2Status.color }}>
            {co2Status.status}
          </p>
        </div>
      </div>

      {/* PM2.5 Card */}
      <div className="card">
        <div className="card-icon">💨</div>
        <div className="card-content">
          <h3>Current PM2.5</h3>
          <p className="card-value">{pm25 !== undefined ? `${pm25} µg/m³` : 'N/A'}</p>
        </div>
      </div>

      {/* Sensor Status Card */}
      <div className="card">
        <div className="card-icon">📊</div>
        <div className="card-content">
          <h3>Sensor Status</h3>
          <p className="card-value">
            Working: {workingSensors || 0} / Total: {totalSensors || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
