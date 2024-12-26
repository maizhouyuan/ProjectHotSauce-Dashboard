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
        // Calculate dynamic date range for current month and past 12 months
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
          .toISOString()
          .split('T')[0];

        console.log(`Fetching data from ${startDate} to ${endDate}`);

        // Fetch temperature data
        const response = await fetch(`/api/weather/monthly-average?latitude=47.6062&longitude=-122.3321&start_date=${startDate}&end_date=${endDate}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Format temperature data for LineChart
        const formattedTemperatureData = data.map(item => ({
          month: item.month,
          avgTemperature: item.avgTemperature,
        }));

        // Fetch CO2 and other data
        const homepageResponse = await fetch('/api/homepage/data');
        if (!homepageResponse.ok) throw new Error(`HTTP error! status: ${homepageResponse.status}`);
        const homepageData = await homepageResponse.json();

        // Format CO2 data for BarChart
        const formattedCo2Data = homepageData.yearlyData.co2.map(item => ({
          month: item.month,
          value: item.value,
        }));

        // Set state with API data
        setTemperatureData(formattedTemperatureData);
        setCo2Data(formattedCo2Data);
        setRealTimeData(homepageData.realTimeData);
        setSensorCounts(homepageData.sensorCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

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
