// pages/DashboardPage.jsx
import React from 'react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import DashboardCards from '../components/DashboardCards';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <div className="charts-container">
        <div className="chart-wrapper">
          <LineChart />
        </div>
        <div className="chart-wrapper">
          <BarChart />
        </div>
      </div>
      <div className="cards-container">
        <DashboardCards />
      </div>
    </div>
  );
};

export default DashboardPage;