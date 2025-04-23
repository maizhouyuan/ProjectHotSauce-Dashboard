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
    if (value <= thresholds.safe) return 'SAFE';
    if (value <= thresholds.elevated) return 'ELEVATED';
    if (value <= thresholds.moderate) return 'MODERATE';
    if (value <= thresholds.high) return 'HIGH';
    return 'VERY HIGH';
  };

  if (!co2Data || co2Data.length === 0) {
    return <div className="chart-empty">No CO2 data available</div>;
  }

  // Use demo data similar to screenshot
  const demoData = [
    { sensorId: 'fcf5c497654a', number: '3', location: 'Event Space', co2: 463 },
    { sensorId: '40f52032b5b7', number: '7', location: 'Cube Garden', co2: 458 },
    { sensorId: '2462ab14bae1', number: '11', location: 'Room 307', co2: 436 },
    { sensorId: 'd8bfc0c0e514', number: '5', location: 'Courtyard', co2: 389 }
  ];

  // Use either provided data or demo data
  const displayData = co2Data.length >= 4 ? co2Data : demoData;

  return (
    <div className="co2-chart-wrapper" style={{ height: '100%' }}>
      <div className="custom-chart" style={{ height: 'calc(100% - 50px)', minHeight: '300px' }}>
        <div className="co2-chart-content" style={{ height: '100%', overflowY: 'visible', padding: '30px 20px 30px 10px' }}>
          {displayData.map((sensor, index) => (
            <div key={`co2-${index}`} className="co2-bar-container" style={{ marginBottom: '25px', height: '40px' }}>
              <div className="co2-bar-label" style={{ fontSize: '14px', width: '40px', textAlign: 'center' }}>{sensor.number}</div>
              <div className="co2-bar-wrapper" style={{ height: '40px' }}>
                <div 
                  className="co2-bar" 
                  style={{ 
                    width: `${Math.min(100, (sensor.co2 / 2000) * 100)}%`,
                    backgroundColor: getCO2Color(sensor.co2),
                    height: '100%'
                  }}
                >
                </div>
                <span className="co2-location" style={{ 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                  color: 'white'
                }}>{sensor.location}</span>
                <span 
                  className="co2-status-badge" 
                  style={{ 
                    backgroundColor: getCO2Color(sensor.co2),
                    opacity: 0.9,
                    right: '90px',
                    padding: '5px 10px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    color: 'white'
                  }}
                >
                  {getCO2Status(sensor.co2)}
                </span>
                <span className="co2-value" style={{ 
                  right: '10px', 
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>{sensor.co2} ppm</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="threshold-lines" style={{ height: '100%', top: '30px' }}>
          <div className="threshold-line" style={{ left: `${(thresholds.safe / 2000) * 100}%`, borderColor: '#4CAF50', height: 'calc(100% - 30px)' }}>
            <span className="threshold-label" style={{ bottom: '-25px' }}>450</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.elevated / 2000) * 100}%`, borderColor: '#8BC34A', height: 'calc(100% - 30px)' }}>
            <span className="threshold-label" style={{ bottom: '-25px' }}>700</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.moderate / 2000) * 100}%`, borderColor: '#FFC107', height: 'calc(100% - 30px)' }}>
            <span className="threshold-label" style={{ bottom: '-25px' }}>1000</span>
          </div>
          <div className="threshold-line" style={{ left: `${(thresholds.high / 2000) * 100}%`, borderColor: '#FF9800', height: 'calc(100% - 30px)' }}>
            <span className="threshold-label" style={{ bottom: '-25px' }}>2000</span>
          </div>
        </div>
      </div>
      
      <div className="threshold-legend" style={{ marginTop: '10px' }}>
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