import React from "react";
import Header from "./Header";
import "../styles/Layout.css";

const Layout = ({ title, onSearch, children }) => {
  return (
    <div className="layout-container">
      <Header title={title} onSearch={onSearch} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
