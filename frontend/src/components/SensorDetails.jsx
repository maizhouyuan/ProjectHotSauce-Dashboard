// components/SensorDetails.jsx
import React from 'react';
import '../styles/SensorDetails.css';

const SensorDetails = ({ sensor }) => {
  if (!sensor) return null;

  return (
    <div className="sensor-details">
      <h2>Sensor Details</h2>
      <div className="details-content">
        <ul>
          <li>Sensor cover needs to be replaced due to damage - 10/22/2024</li>
          <li>Cover is ordered - 10/23/2024</li>
          <li>Sensor was unplugged by accident at 3:30pm on 11/19/2024</li>
        </ul>
      </div>
      <div className="add-notes">
        <h3>Add Notes</h3>
        <textarea 
          placeholder="Add new notes here..."
          rows={4}
        />
        <button className="save-button">Save</button>
      </div>
    </div>
  );
};

export default SensorDetails;