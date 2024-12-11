import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import DashboardCards from '../components/DashboardCards';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/homepage/data');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log('Fetched data:', data); // 检查返回的数据格式
        
        const formattedData = data.yearlyData.temperature.map(item => ({
          month: item.month,
          avgTemperature: item.value,
        }));
        
        setTemperatureData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        <div className="chart-wrapper">
          <LineChart data={temperatureData} />
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
