import React, { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { addDays, format, isAfter, isBefore, subYears } from 'date-fns';
import Select from 'react-select';
import TimeKeeper from 'react-timekeeper';
import '../styles/ReportForm.css';

const ReportForm = ({ onReportGenerate }) => {
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
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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

  // Reused from original code with minor modifications
  const handleReportTypeChange = (selectedOption) => {
    setReportType(selectedOption.value);
    setSelectedSensors([]);
    setErrors({...errors, sensors: null});
  };

  const handleSensorChange = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setSelectedSensors([]);
      setErrors({ ...errors, sensors: null });
      return;
    }

    if (reportType === 'individual') {
      const lastOption = selectedOptions;
      
      if (Array.isArray(lastOption)) {
        const option = lastOption[lastOption.length - 1];
        if (option.value === 'all') {
          setSelectedSensors([sensorOptions[1]]);
        } else {
          setSelectedSensors([option]);
        }
      } else {
        if (lastOption.value === 'all') {
          setSelectedSensors([sensorOptions[1]]);
        } else {
          setSelectedSensors([lastOption]);
        }
      }
    } else {
      const hasAllOption = selectedOptions.some(option => option.value === 'all');
      
      if (hasAllOption) {
        setSelectedSensors(sensorOptions.filter(option => option.value !== 'all'));
      } else {
        setSelectedSensors(selectedOptions);
      }
    }

    setErrors({ ...errors, sensors: null });
  };

  const handleDateRangeChange = (ranges) => {
    setDateRange([ranges.selection]);
    setErrors({ ...errors, dates: null });
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDate = (date) => {
    return format(date, 'MM/dd/yyyy');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (selectedSensors.length === 0) {
      newErrors.sensors = 'Please select at least one sensor';
      isValid = false;
    }

    if (!reportType) {
      newErrors.reportType = 'Please select a report type';
      isValid = false;
    }

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

    if (isAfter(startTime, endTime)) {
      newErrors.time = 'Start time must be before or equal to end time';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    const selectedStart = new Date(dateRange[0].startDate);
    const selectedEnd = new Date(dateRange[0].endDate);
  
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
  
    selectedStart.setHours(startHour, startMin, 0);
    selectedEnd.setHours(endHour, endMin, 59);
  
    const formattedStartDate = format(selectedStart, "yyyy-MM-dd HH:mm:ss");
    const formattedEndDate = format(selectedEnd, "yyyy-MM-dd HH:mm:ss");
  
    try {
      const response = await fetch("http://localhost:3000/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sensorIds: selectedSensors.map(sensor => sensor.value),
          reportType,
          startTime: formattedStartDate,
          endTime: formattedEndDate
        }),
      });
  
      const result = await response.json();
      console.log("API Response:", JSON.stringify(result, null, 2));
  
      if (result.success) {
        const reportConfig = {
          reportType,
          selectedSensors,
          dateRange: dateRange[0],
          startTime,
          endTime
        };
        onReportGenerate(result.data.reportData, reportConfig);
      } else {
        console.error("Report generation failed:", result.message);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
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
          <div onClick={() => setShowStartPicker(true)} className="time-display">
            {startTime}
          </div>
          {showStartPicker && (
            <TimeKeeper
              time={startTime}
              onChange={(newTime) => setStartTime(newTime.formatted24)}
              onDoneClick={() => setShowStartPicker(false)}
              switchToMinuteOnHourSelect
            />
          )}
        </div>

        <div className="time-picker">
          <label>End Time:</label>
          <div onClick={() => setShowEndPicker(true)} className="time-display">
            {endTime}
          </div>
          {showEndPicker && (
            <TimeKeeper
              time={endTime}
              onChange={(newTime) => setEndTime(newTime.formatted24)}
              onDoneClick={() => setShowEndPicker(false)}
              switchToMinuteOnHourSelect
            />
          )}
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
  );
};

export default ReportForm;