import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/ReportView.css';

const ReportView = ({ reportData, reportConfig, onBackToForm, handleDownloadPDF }) => {
  const { reportType, selectedSensors, dateRange, startTime, endTime } = reportConfig;
  const [sensorA, setSensorA] = useState(selectedSensors[0]);
  const [sensorB, setSensorB] = useState(selectedSensors[1]);

  const formatDate = (date) => {
    return format(date, 'MM/dd/yyyy');
  };

  return (
    <div className="report-view">
      <button className="back-button" onClick={onBackToForm}>
        ← Go Back
      </button>
      <button className="download-button" onClick={handleDownloadPDF}>
        📄 Download Report as PDF
      </button>

      <h2>{reportType === 'individual' ? 'Individual' : 'Comparison'} Report</h2>

      <div className="summary-section">
        <h3>Summary</h3>
        <p><strong>Report Type:</strong> {reportType}</p>
        <p><strong>Selected Sensors:</strong> {selectedSensors.map(s => s.label).join(', ')}</p>
        <p><strong>Date Range:</strong> {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}</p>
        <p><strong>Time Range:</strong> {startTime} - {endTime}</p>
      </div>

      {reportType === 'individual' ? (
        <div className="sensor-table-wrapper">
          {Array.isArray(reportData) && reportData.length > 0 ? (
            <table className="sensor-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Temperature (°C)</th>
                  <th>CO2 (ppm)</th>
                  <th>PM2.5</th>
                  <th>Humidity (%)</th>
                </tr>
              </thead>
              <tbody>
                {reportData
                  .filter(data => data["Sensor ID"] === selectedSensors[0].value)
                  .map((data, index) => (
                    <tr key={index}>
                      <td>{data.Timestamp}</td>
                      <td>{data.Temperature}</td>
                      <td>{data.CO2}</td>
                      <td>{data["PM2.5"]}</td>
                      <td>{data.Humidity}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      ) : (
        <>
          <div className="sensor-selectors">
            <label>Compare:</label>
            <select
              value={sensorA?.value}
              onChange={(e) =>
                setSensorA(selectedSensors.find(s => s.value === e.target.value))
              }
            >
              {selectedSensors.map(sensor => (
                <option key={sensor.value} value={sensor.value}>
                  {sensor.label}
                </option>
              ))}
            </select>

            <span>vs</span>

            <select
              value={sensorB?.value}
              onChange={(e) =>
                setSensorB(selectedSensors.find(s => s.value === e.target.value))
              }
            >
              {selectedSensors.map(sensor => (
                <option key={sensor.value} value={sensor.value}>
                  {sensor.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sensor-comparison-wrapper">
            {[sensorA, sensorB].map(sensor => (
              <div key={sensor.value} className="sensor-table-wrapper">
                <h3>{sensor.label}</h3>
                {reportData
                  .filter(data => data["Sensor ID"] === sensor.value)
                  .length > 0 ? (
                  <table className="sensor-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Temperature (°C)</th>
                        <th>CO2 (ppm)</th>
                        <th>PM2.5</th>
                        <th>Humidity (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData
                        .filter(data => data["Sensor ID"] === sensor.value)
                        .map((data, index) => (
                          <tr key={index}>
                            <td>{data.Timestamp}</td>
                            <td>{data.Temperature}</td>
                            <td>{data.CO2}</td>
                            <td>{data["PM2.5"]}</td>
                            <td>{data.Humidity}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No data available for this sensor.</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportView;