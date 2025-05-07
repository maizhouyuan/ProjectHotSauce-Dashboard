import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/LeftNavBar.css";
import nuLogo from "../assets/NU_White_Red_Logo.jpg";

const LeftNavBar = () => {
  return (
    <div className="left-navbar">
      {/* Northeastern University Logo */}
      <div className="logo-container">
        <img src={nuLogo} alt="NU Logo" className="nu-logo" />
      </div>
      
      {/* Navigation links */}
      <nav className="nav-links">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/sensors" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Sensors
        </NavLink>
        
        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          Reports
        </NavLink>
      </nav>
      
      {/* Bottom buttons */}
      <div className="bottom-buttons">
        <button className="settings-button">⚙️</button>
        <button className="logout-button">🚪</button>
      </div>
    </div>
  );
};

export default LeftNavBar;