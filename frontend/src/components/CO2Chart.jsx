import React from 'react';
import '../styles/CO2Chart.css';

const CO2Chart = ({ co2Data }) => {
  // CO2 thresholds
  const thresholds = {
    safe: 450,
    elevated: 700,
    moderate: 1000,
    high: 2000
  };

  // Get color for CO2 level
  const getCO2Color = (value) => {
    if (value <= thresholds.safe) return '#4CAF50'; // Safe 
    if (value <= thresholds.elevated) return '#8BC34A'; // Elevated
    if (value <= thresholds.moderate) return '#FFC107'; // Moderate 
    if (value <= thresholds.high) return '#FF9800'; // High
    return '#F44336'; // Very High
  };

  // Get status text for CO2 level
  const getCO2Status = (value) => {
    if (value <= thresholds.safe) return 'SAFE';
    if (value <= thresholds.elevated) return 'ELEVATED';
    if (value <= thresholds.moderate) return 'MODERATE';
    if (value <= thresholds.high) return 'HIGH';
    return 'VERY HIGH';
  };

  if (!co2Data || co2Data.length === 0) {
    return <div className="chart-empty">No CO2 data available</div>;
  }

  // Sort data by CO2 levels (highest first)
  const displayData = [...co2Data]
    .sort((a, b) => b.co2 - a.co2);

  return (
    <div className="co2-chart-wrapper">
      <h3 className="co2-chart-title">CO2 Levels by Location</h3>
      
      <div className="custom-chart">
        <div className="co2-chart-content">
          {displayData.map((sensor, index) => (
            <div key={`co2-${sensor.sensorId || index}`} className="co2-bar-container">
              <div className="co2-bar-wrapper">
                <div 
                  className="co2-bar" 
                  style={{ 
                    width: `${Math.min(100, (sensor.co2 / 2000) * 100)}%`,
                    backgroundColor: getCO2Color(sensor.co2)
                  }}
                >
                  <span className="co2-location">{sensor.location}</span>
                </div>
                <span 
                  className="co2-status-badge" 
                  style={{ backgroundColor: getCO2Color(sensor.co2) }}
                >
                  {getCO2Status(sensor.co2)}
                </span>
                <span className="co2-value">{sensor.co2} ppm</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="threshold-lines">
          <div className="threshold-line" style={{ left: `${(thresholds.safe / 2000) * 100}%`, borderColor: '#4CAF50' }}>
            <span className="threshold-label">{thresholds.safe}</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.elevated / 2000) * 100}%`, borderColor: '#8BC34A' }}>
            <span className="threshold-label">{thresholds.elevated}</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.moderate / 2000) * 100}%`, borderColor: '#FFC107' }}>
            <span className="threshold-label">{thresholds.moderate}</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.high / 2000) * 100}%`, borderColor: '#FF9800' }}>
            <span className="threshold-label">{thresholds.high}</span>
          </div>
        </div>
      </div>
      
      <div className="threshold-legend">
        <div className="threshold-item">
          <span className="threshold-color" style={{ backgroundColor: '#4CAF50' }}></span>
          <span className="threshold-label">Safe: ≤ 450 ppm</span>
        </div>
        <div className="threshold-item">
          <span className="threshold-color" style={{ backgroundColor: '#8BC34A' }}></span>
          <span className="threshold-label">Elevated: ≤ 700 ppm</span>
        </div>
        <div className="threshold-item">
          <span className="threshold-color" style={{ backgroundColor: '#FFC107' }}></span>
          <span className="threshold-label">Moderate: ≤ 1000 ppm</span>
        </div>
        <div className="threshold-item">
          <span className="threshold-color" style={{ backgroundColor: '#FF9800' }}></span>
          <span className="threshold-label">High: ≤ 2000 ppm</span>
        </div>
        <div className="threshold-item">
          <span className="threshold-color" style={{ backgroundColor: '#F44336' }}></span>
          <span className="threshold-label">Very High: > 2000 ppm</span>
        </div>
      </div>
    </div>
  );
};

export default CO2Chart;