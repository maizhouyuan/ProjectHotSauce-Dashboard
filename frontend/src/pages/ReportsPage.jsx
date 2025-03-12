import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays, format, isAfter, isBefore, isValid, parseISO, subYears } from 'date-fns';
import Select from 'react-select';
import '../styles/ReportsPage.css';
import TimePicker from 'react-time-picker';

const ReportsPage = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('');
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: subYears(new Date(), 1),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
    const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState({});

  const sensorOptions = [
    { value: 'all', label: 'Select All' },
    { value: 'bcff4dd3b24c', label: 'Sensor 2 - Room 110' },
    { value: 'fcf5c497654a', label: 'Sensor 3 - Main Event Space'},
    { value: 'bcff4dd3b442', label: 'Sensor 4 - Room 220' },
    { value: 'd8bfc0c0e514', label: 'Sensor 5 - Courtyard' },
    { value: 'a4cf12ff89ae', label: 'Sensor 6 - Room 216' },
    { value: '40f52032b5b7', label: 'Sensor 7 - Staff Workspace' },
    { value: '08f9e05fd2d3', label: 'Sensor 8 - Room 210' },
    { value: '485519ee6c1a', label: 'Sensor 9 - Lounge Space' },
    { value: '485519ee5010', label: 'Sensor 10 - Study Space' },
    { value: '2462ab14bae1', label: 'Sensor 11 - Room 307' },
    { value: '98f4abd6f8fa', label: 'Sensor 12 - Room 402' },
    { value: '18fe34f753d2', label: 'Sensor 13 - Room 416' }
  ];


  const reportTypeOptions = [
    { value: '', label: 'Select report type...' },
    { value: 'individual', label: 'Individual Report' },
    { value: 'comparison', label: 'Comparison Report' }
  ];

  // Handle report type change
  const handleReportTypeChange = (selectedOption) => {
    setReportType(selectedOption.value);
    // Clear selected sensors when switching report types
    setSelectedSensors([]);
    setErrors({...errors, sensors: null});
  };

  // Handle sensor selection change
  const handleSensorChange = (selectedOptions) => {
    // Handle null or empty selection
    if (!selectedOptions || selectedOptions.length === 0) {
      setSelectedSensors([]);
      setErrors({ ...errors, sensors: null });
      return;
    }

    if (reportType === 'individual') {
      // For individual report, just take the last selected option
      const lastOption = selectedOptions;
      
      if (Array.isArray(lastOption)) {
        // For cases where multiple might be received
        const option = lastOption[lastOption.length - 1];
        if (option.value === 'all') {
          // If "Select All" chosen, use first real sensor
          setSelectedSensors([sensorOptions[1]]);
        } else {
          setSelectedSensors([option]);
        }
      } else {
        // For single selection
        if (lastOption.value === 'all') {
          // If "Select All" chosen, use first real sensor
          setSelectedSensors([sensorOptions[1]]);
        } else {
          setSelectedSensors([lastOption]);
        }
      }
    } else {
      // For comparison reports
      const hasAllOption = selectedOptions.some(option => option.value === 'all');
      
      if (hasAllOption) {
        // If "Select All" chosen, select all sensors except the "all" option
        setSelectedSensors(sensorOptions.filter(option => option.value !== 'all'));
      } else {
        setSelectedSensors(selectedOptions);
      }
    }

    setErrors({ ...errors, sensors: null });
  };

  // Handle date range change
  const handleDateRangeChange = (ranges) => {
    setDateRange([ranges.selection]);
    setErrors({ ...errors, dates: null });
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setErrors({ ...errors, time: null });
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    setErrors({ ...errors, time: null });
  };

  // Toggle date picker visibility
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Format date for display
  const formatDate = (date) => {
    return format(date, 'MM/dd/yyyy');
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate sensors
    if (selectedSensors.length === 0) {
      newErrors.sensors = 'Please select at least one sensor';
      isValid = false;
    }

    // Validate report type
    if (!reportType) {
      newErrors.reportType = 'Please select a report type';
      isValid = false;
    }

    // Validate date range
    const { startDate, endDate } = dateRange[0];
    const now = new Date();
    const fiveYearsAgo = subYears(now, 5);

    if (isAfter(startDate, now) || isAfter(endDate, now)) {
      newErrors.dates = 'Cannot select future dates';
      isValid = false;
    } else if (isAfter(startDate, endDate)) {
      newErrors.dates = 'Start date must be before or equal to end date';
      isValid = false;
    } else if (isBefore(startDate, fiveYearsAgo)) {
      newErrors.dates = 'Date range cannot exceed 5 years';
      isValid = false;
    }

    // Validate time range
    if (isAfter(startTime, endTime)) {
      newErrors.time = 'Start time must be before or equal to end time';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Create formatted date range string
    const formattedDateRange = `${formatDate(dateRange[0].startDate)} - ${formatDate(dateRange[0].endDate)}`;

    // Create mock data based on selected sensors
    const mockData = {
      dateRange: formattedDateRange
    };

    // Add data for each selected sensor
    selectedSensors.forEach(sensor => {
      mockData[sensor.value] = [
        { date: '11/04/2025', ppm: Math.floor(Math.random() * 300) + 400, temperature: Math.floor(Math.random() * 5) + 68 },
        { date: '11/05/2025', ppm: Math.floor(Math.random() * 300) + 400, temperature: Math.floor(Math.random() * 5) + 68 },
        { date: '11/06/2025', ppm: Math.floor(Math.random() * 300) + 400, temperature: Math.floor(Math.random() * 5) + 68 },
        { date: '11/07/2025', ppm: Math.floor(Math.random() * 300) + 400, temperature: Math.floor(Math.random() * 5) + 68 }
      ];
    });

    setReportData(mockData);
    setShowReport(true);
  };

  return (
    <div className="reports-page">
      {!showReport ? (
        <div className="report-form">
          <h2>Choose Report Type:</h2>
          <Select
            options={reportTypeOptions}
            onChange={handleReportTypeChange}
            placeholder="Select report type..."
            className="select-container"
            classNamePrefix="select"
            value={reportTypeOptions.find(option => option.value === reportType)}
          />
          {errors.reportType && <div className="error-message">{errors.reportType}</div>}

          <h2>Choose Sensors:</h2>
          {reportType === 'individual' ? (
            <Select
              options={sensorOptions}
              onChange={(option) => handleSensorChange(option)}
              value={selectedSensors.length > 0 ? selectedSensors[0] : null}
              placeholder="Select a sensor..."
              className="select-container"
              classNamePrefix="select"
              isDisabled={!reportType}
            />
          ) : (
            <Select
              options={sensorOptions}
              isMulti
              onChange={handleSensorChange}
              value={selectedSensors}
              placeholder="Select sensors..."
              className="select-container"
              classNamePrefix="select"
              isDisabled={!reportType}
            />
          )}
          {errors.sensors && <div className="error-message">{errors.sensors}</div>}
          
          <h2>Choose Date Range</h2>
          <div className="date-selector">
            <div className="date-display" onClick={toggleDatePicker}>
              {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
            </div>
            {showDatePicker && (
              <div className="date-picker-container">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={handleDateRangeChange}
                  maxDate={new Date()}
                  minDate={subYears(new Date(), 5)}
                />
                <button className="close-datepicker" onClick={toggleDatePicker}>
                  Done
                </button>
              </div>
            )}
          </div>
          {errors.dates && <div className="error-message">{errors.dates}</div>}

          <div className="time-selector">
            <h2>Choose Time Range</h2>
            <div className="time-picker">
              <label>Start Time:</label>
              <TimePicker
                value={startTime}
                onChange={handleStartTimeChange}
                disableClock={true}
                format="HH:mm"
                clearIcon={null}
              />
            </div>
            <div className="time-picker">
              <label>End Time:</label>
              <TimePicker
                value={endTime}
                onChange={handleEndTimeChange}
                disableClock={true}
                format="HH:mm"
                clearIcon={null}
              />
            </div>
            {errors.time && <div className="error-message">{errors.time}</div>}
          </div>

          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!reportType || selectedSensors.length === 0}
          >
            Generate Report
          </button>
        </div>
      ) : (
        <div className="report-view">
          <button className="back-button" onClick={() => setShowReport(false)}>
            ← Go Back
          </button>
          <h2>{reportType === 'individual' ? 'Individual' : 'Comparison'} Report</h2>
          
          <div className="report-content">
            <div className="sensor-cards">
              {selectedSensors.map(sensor => (
                <div key={sensor.value} className="sensor-card">
                  <h3>{sensor.label}</h3>
                  {reportData?.[sensor.value].map((data, index) => (
                    <div key={index} className="data-row">
                      {data.date} | ppm {data.ppm} | Temperature {data.temperature}
                    </div>
                  ))}
                </div>
              ))}
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