import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import DashboardCards from '../components/DashboardCards';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [co2Data, setCo2Data] = useState({});
  const [realTimeData, setRealTimeData] = useState({});
  const [sensorCounts, setSensorCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setError(null);
        setIsLoading(true);

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
        console.log('Received homepage data:', homepageData);

        // Validate CO2 data
        const formattedCo2Data = homepageData.yearlyData.co2
          .filter(item => item && typeof item.value === 'number' && !isNaN(item.value))
          .map(item => ({
            month: item.month,
            value: item.value,
          }));

        // Set state with API data
        setTemperatureData(formattedTemperatureData);
        setCo2Data({
          yearlyData: {
            co2: formattedCo2Data
          }
        });
        console.log('Setting real-time data:', homepageData.realTimeData);
        
        // Get the most recent CO2 value from yearly data if realTimeData.co2 is not available
        const mostRecentCo2 = formattedCo2Data.length > 0 
          ? formattedCo2Data[formattedCo2Data.length - 1].value 
          : null;

        // Always use the CO2 value from the first working sensor (sensor-001)
        setRealTimeData({
          temperature: homepageData.realTimeData.temperature,
          pm25: homepageData.realTimeData.pm25,
          co2: homepageData.realTimeData.co2  // This is from sensor-001 which is working
        });

        // Use actual sensor counts from the backend
        setSensorCounts(homepageData.sensorCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // Set up polling for real-time updates every 5 minutes
    const pollInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, []);

  if (isLoading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="charts-container">
        {/* Line Chart for Temperature */}
        <div className="chart-wrapper">
          <LineChart data={temperatureData} />
        </div>

        {/* Bar Chart for CO2 */}
        <div className="chart-wrapper">
          <BarChart data={{
            realTimeData: realTimeData,
            sensorCounts: sensorCounts
          }} />
        </div>
      </div>

      {/* Real-time Data Cards */}
      <div className="cards-container">
        <DashboardCards
          temperature={realTimeData.temperature}
          pm25={realTimeData.pm25}
          co2={realTimeData.co2}
          totalSensors={sensorCounts.total}
          workingSensors={sensorCounts.working}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
