import React, { useState } from 'react';
import { format } from 'date-fns';
import ReportCharts from './ReportCharts';
import '../styles/ReportView.css';
import '../styles/ReportCharts.css';

const ReportView = ({ reportData, reportConfig, onBackToForm, handleDownloadPDF }) => {
  const { reportType, selectedSensors, dateRange, startTime, endTime } = reportConfig;
  const [sensorA, setSensorA] = useState(selectedSensors[0]);
  const [sensorB, setSensorB] = useState(selectedSensors[1]);
  const [temperatureUnit, setTemperatureUnit] = useState('C'); // Default to Celsius

  const formatDate = (date) => {
    return format(date, 'MM/dd/yyyy');
  };

  // Convert temperature values based on selected unit
  const convertTemperature = (celsius) => {
    if (temperatureUnit === 'F') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

  // Format temperature values for display with the correct unit
  const formatTemperature = (celsius) => {
    if (celsius === undefined || celsius === null) return 'N/A';
    const temp = convertTemperature(parseFloat(celsius));
    return `${temp.toFixed(1)}°${temperatureUnit}`;
  };

  // Toggle between Celsius and Fahrenheit
  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'C' ? 'F' : 'C');
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

        <div className="temperature-unit-toggle">
          <span>Temperature Unit:</span>
          <button 
            className={`unit-button ${temperatureUnit === 'C' ? 'active' : ''}`}
            onClick={() => setTemperatureUnit('C')}
          >
            °C
          </button>
          <button 
            className={`unit-button ${temperatureUnit === 'F' ? 'active' : ''}`}
            onClick={() => setTemperatureUnit('F')}
          >
            °F
          </button>
        </div>
      </div>

      {/* Add charts visualization component */}
      <ReportCharts 
        reportData={reportData} 
        sensorIds={reportType === 'individual' ? [selectedSensors[0]] : selectedSensors}
        temperatureUnit={temperatureUnit}
      />

      {reportType === 'individual' ? (
        <div className="sensor-table-wrapper">
          {Array.isArray(reportData) && reportData.length > 0 ? (
            <table className="sensor-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Temperature (°{temperatureUnit})</th>
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
                      <td>{formatTemperature(data.Temperature)}</td>
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
                        <th>Temperature (°{temperatureUnit})</th>
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
                            <td>{formatTemperature(data.Temperature)}</td>
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