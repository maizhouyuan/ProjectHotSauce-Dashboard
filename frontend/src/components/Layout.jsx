import React from "react";
import Header from "./Header";
import LeftNavBar from "./LeftNavBar";
import "../styles/Layout.css";

const Layout = ({ title, children }) => {
  return (
    <div className="layout-container">
      {/* Left navigation bar */}
      <LeftNavBar />
      {/* Main content area */}
      <div className="main-content">
        {/* Top header with title */}
        <Header title={title} />
        {/* Page's primary content */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
