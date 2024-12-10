import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/LeftNavBar.css";
import nuLogo from "../assets/NU_White_Red_Logo.jpg";

const LeftNavBar = () => {
  return (
    <div className="left-navbar">
      {/* Northeastern Logo */}
      <div className="logo-container">
        <img src={nuLogo} alt="NU Logo" className="nu-logo" />
      </div>

      {/* 导航链接 */}
      <nav className="nav-links">
        <NavLink to="/dashboard" className="nav-item" activeClassName="active">
          Dashboard
        </NavLink>
        <NavLink to="/sensors" className="nav-item" activeClassName="active">
          Sensors
        </NavLink>
        <NavLink to="/reports" className="nav-item" activeClassName="active">
          Reports
        </NavLink>
      </nav>

      {/* 底部按钮 */}
      <div className="bottom-buttons">
        <button className="settings-button">⚙️</button>
        <button className="logout-button">🚪</button>
      </div>
    </div>
  );
};

export default LeftNavBar;