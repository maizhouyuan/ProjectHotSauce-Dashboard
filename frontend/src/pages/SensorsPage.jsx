import React, { useState } from 'react';
import SensorGrid from '../components/SensorGrid';
import SensorDetail from '../components/SensorDetail';
import '../styles/SensorsPage.css';

const SensorsPage = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState('F');

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  const handleCloseDetail = () => {
    setSelectedSensor(null);
  };

  const handleTemperatureUnitChange = (unit) => {
    setTemperatureUnit(unit);
  };

  return (
    <div className="sensors-page">
      <div className={`sensors-container ${selectedSensor ? 'with-detail' : ''}`}>
        <SensorGrid 
          onSensorClick={handleSensorClick}
          temperatureUnit={temperatureUnit}
          onTemperatureUnitChange={handleTemperatureUnitChange}
        />
      </div>
      {selectedSensor && (
        <div className="sensor-detail-container">
          <SensorDetail
            sensor={selectedSensor}
            onClose={handleCloseDetail}
            temperatureUnit={temperatureUnit}
          />
        </div>
      )}
    </div>
  );
};

export default SensorsPage;