import React from 'react';

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
    if (value <= thresholds.safe) return 'Safe';
    if (value <= thresholds.elevated) return 'Elevated';
    if (value <= thresholds.moderate) return 'Moderate';
    if (value <= thresholds.high) return 'High';
    return 'Very High';
  };

  if (!co2Data || co2Data.length === 0) {
    return <div className="chart-empty">No CO2 data available</div>;
  }

  // Sort data by CO2 level (highest to lowest)
  const sortedData = [...co2Data].sort((a, b) => b.co2 - a.co2);

  return (
    <div className="co2-chart-wrapper">
      <div className="custom-chart">
        <div className="co2-chart-content">
          {sortedData.map((sensor, index) => (
            <div key={`co2-${index}`} className="co2-bar-container">
              <div className="co2-bar-label">{sensor.number}</div>
              <div className="co2-bar-wrapper">
                <div 
                  className="co2-bar" 
                  style={{ 
                    width: `${Math.min(100, (sensor.co2 / 2000) * 100)}%`,
                    backgroundColor: getCO2Color(sensor.co2)
                  }}
                >
                  {/* Display status badge inside the bar for better visibility */}
                  <span className="co2-status-badge" 
                    style={{ 
                      backgroundColor: getCO2Color(sensor.co2),
                      opacity: 0.9
                    }}
                  >
                    {getCO2Status(sensor.co2)}
                  </span>
                </div>
                <span className="co2-location">{sensor.location}</span>
                <span className="co2-value">{sensor.co2} ppm</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="threshold-lines">
          <div className="threshold-line" style={{ left: `${(thresholds.safe / 2000) * 100}%`, borderColor: '#4CAF50' }}>
            <span className="threshold-label">450</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.elevated / 2000) * 100}%`, borderColor: '#8BC34A' }}>
            <span className="threshold-label">700</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.moderate / 2000) * 100}%`, borderColor: '#FFC107' }}>
            <span className="threshold-label">1000</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.high / 2000) * 100}%`, borderColor: '#FF9800' }}>
            <span className="threshold-label">2000</span>
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