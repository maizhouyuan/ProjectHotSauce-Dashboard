import React from "react";
import "../styles/Header.css";

const Header = ({ title }) => {
  return (
    <header className="header">
      {/* 页面标题 */}
      <h1>{title}</h1>

      {/* 搜索框 */}
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