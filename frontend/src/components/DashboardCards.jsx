// components/DashboardCards.jsx
import React from 'react';
import '../styles/DashboardCards.css';

const DashboardCards = () => {
  return (
    <div className="dashboard-cards">
      <div className="card">
        <div className="card-icon">🌡️</div>
        <div className="card-content">
          <h3>Temperature</h3>
          <p className="card-value">17 C</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-icon">💨</div>
        <div className="card-content">
          <h3>PM 2.5</h3>
          <p className="card-value">2.1</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-icon">📊</div>
        <div className="card-content">
          <h3>Total Sensors</h3>
          <p className="card-value">12</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;