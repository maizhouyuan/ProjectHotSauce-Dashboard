import React from 'react';
import '../styles/DashboardCards.css';

const DashboardCards = ({ temperature, pm25, totalSensors, workingSensors }) => {
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
