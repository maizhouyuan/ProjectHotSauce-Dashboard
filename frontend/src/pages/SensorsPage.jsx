// pages/SensorsPage.jsx
import React, { useState } from 'react';
import SensorGrid from '../components/SensorGrid';
import SensorDetails from '../components/SensorDetails';
import '../styles/SensorsPage.css';

const SensorsPage = () => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="sensors-page">
      <div className="sensors-container">
        <SensorGrid onSensorClick={handleSensorClick} />
      </div>
      <SensorDetails sensor={selectedSensor} />
    </div>
  );
};

export default SensorsPage;