// components/SensorGrid.jsx
import React from 'react';
import '../styles/SensorGrid.css';

const SensorGrid = ({ onSensorClick }) => {
  const sensors = [
    { id: 1, name: 'Sensor 1', floor: 1, status: 'active' },
    { id: 2, name: 'Sensor 2', floor: 1, status: 'active' },
    { id: 3, name: 'Sensor 3', floor: 1, status: 'active' },
    { id: 14, name: 'Sensor 14', floor: 1, location: 'External', status: 'error' },
    { id: 4, name: 'Sensor 4', floor: 2, status: 'active' },
    { id: 5, name: 'Sensor 5', floor: 2, status: 'active' },
    { id: 6, name: 'Sensor 6', floor: 2, status: 'active' },
    { id: 7, name: 'Sensor 7', floor: 3, status: 'active' },
    { id: 8, name: 'Sensor 8', floor: 3, status: 'active' },
    { id: 9, name: 'Sensor 9', floor: 3, status: 'active' },
    { id: 10, name: 'Sensor 10', floor: 3, status: 'active' },
    { id: 11, name: 'Sensor 11', floor: 4, location: '416', status: 'active' },
    { id: 12, name: 'Sensor 12', floor: 4, location: 'Cube Garden', status: 'active' },
    { id: 13, name: 'Sensor 13', floor: 4, location: 'San Juan', status: 'active' },
  ];

  return (
    <div className="sensor-grid">
      {[4, 3, 2, 1].map(floor => (
        <div key={floor} className="floor-section">
          <div className="floor-number">{floor}</div>
          <div className="sensors-row">
            {sensors
              .filter(sensor => sensor.floor === floor)
              .map(sensor => (
                <div
                  key={sensor.id}
                  className={`sensor-card ${sensor.status}`}
                  onClick={() => onSensorClick(sensor)}
                >
                  <div className="sensor-name">Sensor {sensor.id}</div>
                  {sensor.location && (
                    <div className="sensor-location">{sensor.location}</div>
                  )}
                  <div className={`status-indicator ${sensor.status}`} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SensorGrid;