import React, { useState, useRef, useEffect } from 'react';
import '../styles/ImprovedTimeSelector.css';

const ImprovedTimeSelector = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [localStartTime, setLocalStartTime] = useState(startTime || '00:00');
  const [localEndTime, setLocalEndTime] = useState(endTime || '23:59');
  
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  // Parse time string into hours and minutes
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  // Format hours and minutes into time string
  const formatTime = (hours, minutes) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Generate array of hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate array of minutes (0-59, by 5)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // Handle clicks outside the time picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target)) {
        setShowStartPicker(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target)) {
        setShowEndPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle time selection for start time
  const handleStartTimeChange = (hours, minutes) => {
    const newTime = formatTime(hours, minutes);
    setLocalStartTime(newTime);
    onStartTimeChange(newTime);
    setShowStartPicker(false);
  };

  // Handle time selection for end time
  const handleEndTimeChange = (hours, minutes) => {
    const newTime = formatTime(hours, minutes);
    setLocalEndTime(newTime);
    onEndTimeChange(newTime);
    setShowEndPicker(false);
  };

  // Format time for display
  const formatDisplayTime = (timeString) => {
    const { hours, minutes } = parseTime(timeString);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="improved-time-selector">
      <div className="time-selector-header">Choose Time Range</div>
      
      <div className="time-fields">
        <div className="time-field">
          <label>Start Time:</label>
          <div 
            className="time-display" 
            onClick={() => {
              setShowStartPicker(true);
              setShowEndPicker(false);
            }}
          >
            <span className="time-value">{formatDisplayTime(localStartTime)}</span>
            <span className="time-icon">⌚</span>
          </div>
          
          {showStartPicker && (
            <div className="time-picker-dropdown" ref={startPickerRef}>
              <div className="time-picker-content">
                <div className="time-picker-header">Select Start Time</div>
                <div className="time-picker-columns">
                  <div className="time-column hours-column">
                    <div className="time-column-header">Hour</div>
                    <div className="time-column-options">
                      {hours.map(hour => (
                        <div
                          key={`hour-${hour}`}
                          className={`time-option ${parseTime(localStartTime).hours === hour ? 'selected' : ''}`}
                          onClick={() => handleStartTimeChange(hour, parseTime(localStartTime).minutes)}
                        >
                          {hour.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="time-column minutes-column">
                    <div className="time-column-header">Minute</div>
                    <div className="time-column-options">
                      {minutes.map(minute => (
                        <div
                          key={`minute-${minute}`}
                          className={`time-option ${parseTime(localStartTime).minutes === minute ? 'selected' : ''}`}
                          onClick={() => handleStartTimeChange(parseTime(localStartTime).hours, minute)}
                        >
                          {minute.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="time-picker-quick-options">
                  <button onClick={() => handleStartTimeChange(0, 0)}>12:00 AM</button>
                  <button onClick={() => handleStartTimeChange(6, 0)}>6:00 AM</button>
                  <button onClick={() => handleStartTimeChange(9, 0)}>9:00 AM</button>
                  <button onClick={() => handleStartTimeChange(12, 0)}>12:00 PM</button>
                  <button onClick={() => handleStartTimeChange(17, 0)}>5:00 PM</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="time-field">
          <label>End Time:</label>
          <div 
            className="time-display" 
            onClick={() => {
              setShowEndPicker(true);
              setShowStartPicker(false);
            }}
          >
            <span className="time-value">{formatDisplayTime(localEndTime)}</span>
            <span className="time-icon">⌚</span>
          </div>
          
          {showEndPicker && (
            <div className="time-picker-dropdown" ref={endPickerRef}>
              <div className="time-picker-content">
                <div className="time-picker-header">Select End Time</div>
                <div className="time-picker-columns">
                  <div className="time-column hours-column">
                    <div className="time-column-header">Hour</div>
                    <div className="time-column-options">
                      {hours.map(hour => (
                        <div
                          key={`hour-${hour}`}
                          className={`time-option ${parseTime(localEndTime).hours === hour ? 'selected' : ''}`}
                          onClick={() => handleEndTimeChange(hour, parseTime(localEndTime).minutes)}
                        >
                          {hour.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="time-column minutes-column">
                    <div className="time-column-header">Minute</div>
                    <div className="time-column-options">
                      {minutes.map(minute => (
                        <div
                          key={`minute-${minute}`}
                          className={`time-option ${parseTime(localEndTime).minutes === minute ? 'selected' : ''}`}
                          onClick={() => handleEndTimeChange(parseTime(localEndTime).hours, minute)}
                        >
                          {minute.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="time-picker-quick-options">
                  <button onClick={() => handleEndTimeChange(12, 0)}>12:00 PM</button>
                  <button onClick={() => handleEndTimeChange(17, 0)}>5:00 PM</button>
                  <button onClick={() => handleEndTimeChange(20, 0)}>8:00 PM</button>
                  <button onClick={() => handleEndTimeChange(23, 59)}>11:59 PM</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="time-range-info">
        <div className="time-range-description">
          <span className="info-icon">ℹ️</span>
          <span>Selected range: {formatDisplayTime(localStartTime)} to {formatDisplayTime(localEndTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default ImprovedTimeSelector;