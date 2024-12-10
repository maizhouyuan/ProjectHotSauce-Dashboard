import React, { useState } from 'react';
import '../styles/ReportsPage.css';

const ReportsPage = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleSubmit = (formData) => {
    // Mock report data
    const mockData = {
      sensor3: [
        { date: '11/04/2025', ppm: 500, temperature: 70 },
        { date: '11/05/2025', ppm: 640, temperature: 68 },
        { date: '11/06/2025', ppm: 642, temperature: 69 },
        { date: '11/07/2025', ppm: 600, temperature: 69 }
      ],
      sensor7: [
        { date: '11/04/2025', ppm: 400, temperature: 72 },
        { date: '11/05/2025', ppm: 630, temperature: 70 },
        { date: '11/06/2025', ppm: 542, temperature: 69 },
        { date: '11/07/2025', ppm: 550, temperature: 68 }
      ],
      dateRange: '11/04/2024 - 11/10/2025'
    };
    setReportData(mockData);
    setShowReport(true);
  };

  return (
    <div className="reports-page">
      {!showReport ? (
        <div className="report-form">
          <h2>Choose Sensors:</h2>
          <select>
            <option value="">Select a sensor...</option>
            <option value="sensor3">Sensor 3</option>
            <option value="sensor7">Sensor 7</option>
          </select>

          <h2>Choose Report Type:</h2>
          <select>
            <option value="">Select report type...</option>
            <option value="comparison">Comparison Report</option>
            <option value="summary">Summary Report</option>
          </select>

          <h2>Choose Dates</h2>
          <div className="date-inputs">
            <div className="date-field">
              <label>Date</label>
              <input type="text" placeholder="mm/dd/yyyy" />
            </div>
            <div className="date-field">
              <label>Date</label>
              <input type="text" placeholder="mm/dd/yyyy" />
            </div>
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      ) : (
        <div className="report-view">
          <button className="back-button" onClick={() => setShowReport(false)}>
            ← Go Back
          </button>
          <h2>Comparison Report</h2>
          
          <div className="report-content">
            <div className="sensor-cards">
              <div className="sensor-card">
                <h3>Sensor 3</h3>
                {reportData?.sensor3.map((data, index) => (
                  <div key={index} className="data-row">
                    {data.date} | ppm {data.ppm} | Temperature {data.temperature}
                  </div>
                ))}
              </div>
              
              <div className="sensor-card">
                <h3>Sensor 7</h3>
                {reportData?.sensor7.map((data, index) => (
                  <div key={index} className="data-row">
                    {data.date} | ppm {data.ppm} | Temperature {data.temperature}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="date-range">
              {reportData?.dateRange}
            </div>
            
            <button className="download-button">
              Download Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;