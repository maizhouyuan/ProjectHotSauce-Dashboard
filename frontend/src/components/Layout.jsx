import React from "react";
import Header from "./Header";
import LeftNavBar from "./LeftNavBar";
import "../styles/Layout.css";

const Layout = ({ title, children }) => {
  return (
    <div className="layout-container">
      {/* 左侧导航栏 */}
      <LeftNavBar />
      {/* 主内容区域 */}
      <div className="main-content">
        {/* 顶部标题 */}
        <Header title={title} />
        {/* 页面主要内容 */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;