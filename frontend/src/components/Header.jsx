import React from "react";
import "../styles/Header.css";

const Header = ({ title }) => {
  return (
    <header className="header">
      {/* Page Title */}
      <h1>{title}</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input"
        />
      </div>
    </header>
  );
};

export default Header;