// components/ReportView.jsx
import React from 'react';
import '../styles/ReportView.css';

const ReportView = ({ reportData, onBack }) => {
  return (
    <div className="report-view">
      <div className="report-header">
        <button className="back-button" onClick={onBack}>
          ← Go Back
        </button>
        <h2>Comparison Report</h2>
      </div>

      <div className="report-content">
        <div className="sensor-data">
          <div className="sensor-card">
            <h3>Sensor 3</h3>
            <div className="data-list">
              <div className="data-item">11/04/2025 | ppm 500 | Temperature 70</div>
              <div className="data-item">11/05/2025 | ppm 640 | Temperature 68</div>
              <div className="data-item">11/06/2025 | ppm 642 | Temperature 69</div>
              <div className="data-item">11/07/2025 | ppm 600 | Temperature 69</div>
            </div>
          </div>

          <div className="sensor-card">
            <h3>Sensor 7</h3>
            <div className="data-list">
              <div className="data-item">11/04/2025 | ppm 400 | Temperature 72</div>
              <div className="data-item">11/05/2025 | ppm 630 | Temperature 70</div>
              <div className="data-item">11/06/2025 | ppm 542 | Temperature 69</div>
              <div className="data-item">11/07/2025 | ppm 550 | Temperature 68</div>
            </div>
          </div>
        </div>

        <div className="date-range">11/04/2024 - 11/10/2025</div>
        
        <button className="download-button">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportView;