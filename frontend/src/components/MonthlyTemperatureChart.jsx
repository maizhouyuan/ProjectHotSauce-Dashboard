import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import '../styles/MonthlyTemperatureChart.css';

// Register required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MonthlyTemperatureChart = ({ temperatureUnit }) => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Use useRef to store chart instance for cleanup
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Force chart instance cleanup and recreation when unit changes
    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [temperatureUnit]);

    useEffect(() => {
        // Check if we already have cached data for this month
        checkAndFetchMonthlyData();
        
        // Cleanup chart instance on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []);
    
    // Check localStorage for cached data and fetch only if needed
    const checkAndFetchMonthlyData = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Create a cache key using year and month
        const cacheKey = `monthlyTempData_${currentYear}_${currentMonth}`;
        
        try {
            // Try to get cached data
            const cachedData = localStorage.getItem(cacheKey);
            
            if (cachedData) {
                // Parse and use the cached data
                const parsedData = JSON.parse(cachedData);
                console.log('Using cached monthly temperature data from localStorage');
                setChartData(parsedData);
                setIsLoading(false);
            } else {
                // No cache found, fetch new data
                console.log('No cached data found for this month, fetching new data');
                fetchMonthlyTemperatureData(cacheKey);
            }
        } catch (error) {
            // If any error occurs with localStorage, fetch data
            console.error('Error accessing localStorage:', error);
            fetchMonthlyTemperatureData(cacheKey);
        }
    };
    
    // Fetch real temperature data from the API
    const fetchMonthlyTemperatureData = async (cacheKey) => {
        setIsLoading(true);
        try {
            // Use the dedicated endpoint for monthly temperature data
            const response = await fetch('/api/homepage/monthly-temperature');
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Monthly temperature API response:', data);
            
            if (data && data.length > 0) {
                // Process the API data
                const processedData = processApiData(data);
                
                // Cache the processed data for this month
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(processedData));
                    console.log('Cached monthly temperature data to localStorage');
                } catch (cacheError) {
                    console.warn('Failed to cache monthly data:', cacheError);
                }
                
                setChartData(processedData);
            } else {
                // Try the homepage data API as fallback
                const homepageResponse = await fetch('/api/homepage/data');
                
                if (!homepageResponse.ok) {
                    throw new Error(`Homepage API error: ${homepageResponse.status}`);
                }
                
                const homepageData = await homepageResponse.json();
                
                if (homepageData && homepageData.sensors && homepageData.sensors.length > 0) {
                    // Process sensor data to get monthly averages
                    const processedData = processHomepageData(homepageData.sensors);
                    
                    // Cache the processed data for this month
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify(processedData));
                        console.log('Cached monthly temperature data to localStorage');
                    } catch (cacheError) {
                        console.warn('Failed to cache monthly data:', cacheError);
                    }
                    
                    setChartData(processedData);
                } else {
                    throw new Error('No data available');
                }
            }
        } catch (error) {
            console.error('Error fetching monthly temperature data:', error);
            setError(error.message);
            
            // Fallback to demo data if both API calls fail
            generateDemoData();
        } finally {
            setIsLoading(false);
        }
    };
    
    // Process data from the dedicated monthly temperature endpoint
    const processApiData = (data) => {
        // Extract month names and temperature values
        const monthNames = data.map(item => {
            // Convert YYYY-MM format to short month name
            const date = new Date(item.month);
            return date.toLocaleString('default', { month: 'short' });
        });
        
        const temperatures = data.map(item => item.avgTemperature);
        
        return {
            labels: monthNames,
            datasets: [
                {
                    label: `Monthly Average Temperature (°C)`,
                    data: temperatures,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };
    
    // Process data from the homepage API
    const processHomepageData = (sensors) => {
        // Track temperature data by month across all sensors
        const temperatureByMonth = {};
        let monthCount = 0;
        
        // Current year
        const currentYear = new Date().getFullYear();
        
        // Aggregate temperature data from all sensors
        sensors.forEach(sensor => {
            if (sensor.yearlyData && sensor.yearlyData.temperature && 
                Array.isArray(sensor.yearlyData.temperature)) {
                
                sensor.yearlyData.temperature.forEach(monthData => {
                    // Only include data for the current year
                    if (monthData.month && monthData.month.startsWith(currentYear.toString())) {
                        const month = monthData.month;
                        
                        if (!temperatureByMonth[month]) {
                            temperatureByMonth[month] = {
                                sum: 0,
                                count: 0
                            };
                        }
                        
                        // Add this sensor's temperature reading
                        if (monthData.value !== null && monthData.value !== undefined) {
                            temperatureByMonth[month].sum += parseFloat(monthData.value);
                            temperatureByMonth[month].count += 1;
                            monthCount++;
                        }
                    }
                });
            }
        });
        
        if (monthCount === 0) {
            console.warn('No temperature data found in sensors');
            return generateDemoData(true);
        }
        
        // Convert to array and calculate averages
        const processedData = Object.entries(temperatureByMonth)
            .map(([month, data]) => ({
                month,
                value: data.sum / data.count
            }))
            .sort((a, b) => a.month.localeCompare(b.month));
        
        // Extract month names and temperature values
        const monthNames = processedData.map(item => {
            const date = new Date(item.month);
            return date.toLocaleString('default', { month: 'short' });
        });
        
        const temperatures = processedData.map(item => item.value);
        
        return {
            labels: monthNames,
            datasets: [
                {
                    label: `Monthly Average Temperature (°C)`,
                    data: temperatures,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };
    
    // Generate demo data if both API calls fail
    const generateDemoData = (returnData = false) => {
        // Current year and month
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-11
        
        // Month names
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Demo temperature data (Celsius) - adjust these values as needed
        const temperatureData = [
            5.2, 6.5, 8.9, 12.4, 15.8, 19.2, 
            22.5, 21.8, 18.4, 13.7, 9.2, 6.3
        ];
        
        // Only include months up to current month
        const labels = months.slice(0, currentMonth + 1);
        const data = temperatureData.slice(0, currentMonth + 1);
        
        const demoData = {
            labels,
            datasets: [
                {
                    label: `Monthly Average Temperature (°C)`,
                    data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
        
        if (returnData) {
            return demoData;
        } else {
            setChartData(demoData);
        }
    };
    
    // Convert temperatures if needed
    const convertTemperature = (celsius) => {
        if (temperatureUnit === 'F') {
            return (celsius * 9/5) + 32;
        }
        return celsius;
    };
    
    // Create chart options - base options without conversion
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.parsed.y.toFixed(1)}°${temperatureUnit}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: '#f0f0f0'
                },
                ticks: {
                    callback: (value) => {
                        return `${value.toFixed(1)}°${temperatureUnit}`;
                    },
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 14  // Increase font size for month labels
                    },
                    color: '#333',  // Darker color for better visibility
                    maxRotation: 45, // Rotate labels to prevent overlap
                    minRotation: 45, // Rotate labels to prevent overlap
                    autoSkip: false, // Don't skip labels
                    padding: 10 // Add padding for better spacing
                }
            }
        },
        animation: false, // Disable animations to avoid canvas issues
        layout: {
            padding: {
                bottom: 20 // Add more bottom padding for rotated labels
            }
        }
    };
    
    if (isLoading) {
        return <div className="chart-loading">Loading temperature data...</div>;
    }
    
    if (error) {
        return <div className="chart-empty">Unable to load temperature data. Using demo values.</div>;
    }
    
    if (!chartData) {
        return <div className="chart-empty">No temperature data available</div>;
    }

    // Apply conversion to the data but not in the scales/tooltip callbacks
    const displayData = {
        ...chartData,
        datasets: chartData.datasets.map(dataset => ({
            ...dataset,
            data: dataset.data.map(value => 
                temperatureUnit === 'F' ? convertTemperature(value) : value
            ),
            label: `Monthly Average Temperature (°${temperatureUnit})`
        }))
    };

    return (
        <div className="temperature-chart-container">
            <div className="temperature-chart-wrapper">
                <Line 
                    key={`temp-chart-${Date.now()}`}
                    data={displayData} 
                    options={baseOptions}
                    ref={(reference) => {
                        // Store references for cleanup
                        chartRef.current = reference;
                        if (reference) {
                            chartInstanceRef.current = reference;
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default MonthlyTemperatureChart;