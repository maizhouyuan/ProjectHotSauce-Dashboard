import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', overlay = false, size = 'medium' }) => {
  // Size classes
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={`loading-spinner ${sizeClasses[size]}`}></div>
        {message && <p className="spinner-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;