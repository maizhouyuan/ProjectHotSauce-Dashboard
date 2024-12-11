import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import DashboardCards from '../components/DashboardCards';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [sensorCounts, setSensorCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/homepage/data'); // API endpoint
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Format temperature data for LineChart
        const formattedTemperatureData = data.yearlyData.temperature.map(item => ({
          month: item.month,
          avgTemperature: item.value,
        }));

        // Format CO2 data for BarChart
        const formattedCo2Data = data.yearlyData.co2.map(item => ({
          month: item.month,
          value: item.value,
        }));

        // Set state with API data
        setTemperatureData(formattedTemperatureData);
        setCo2Data(formattedCo2Data);
        setRealTimeData(data.realTimeData);
        setSensorCounts(data.sensorCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        {/* Line Chart for Temperature */}
        <div className="chart-wrapper">
          <LineChart data={temperatureData} />
        </div>

        {/* Bar Chart for CO2 */}
        <div className="chart-wrapper">
          <BarChart data={co2Data} />
        </div>
      </div>

      {/* Real-time Data Cards */}


      <div className="cards-container">
        <DashboardCards
          temperature={realTimeData.temperature}
          pm25={realTimeData.pm25}
          totalSensors={sensorCounts.total}
          workingSensors={sensorCounts.working}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
