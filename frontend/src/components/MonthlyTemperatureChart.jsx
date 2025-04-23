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
        fetchMonthlyTemperatureData();
        
        // Cleanup chart instance on component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []);
    
    // Fetch real temperature data from homepage endpoint
    const fetchMonthlyTemperatureData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/homepage/data');
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Monthly temperature API response:', data);
            
            if (data && data.sensors && data.sensors.length > 0) {
                // Process the data to get monthly averages across all sensors
                processRealData(data.sensors);
            } else {
                throw new Error('No sensor data available');
            }
        } catch (error) {
            console.error('Error fetching monthly temperature data:', error);
            setError(error.message);
            
            // Fallback to demo data
            generateDemoData();
        } finally {
            setIsLoading(false);
        }
    };
    
    // Process real sensor data 
    const processRealData = (sensors) => {
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
            generateDemoData();
            return;
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
        
        setChartData({
            labels: monthNames,
            datasets: [
                {
                    label: `Monthly Average Temperature (°${temperatureUnit})`,
                    data: temperatures,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        });
    };
    
    // Generate demo data if API fails
    const generateDemoData = () => {
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
        
        setChartData({
            labels,
            datasets: [
                {
                    label: `Monthly Average Temperature (°${temperatureUnit})`,
                    data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        });
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
                        // Will apply conversion in final options
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
                        // Will apply conversion in final options
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
                    color: '#333'  // Darker color for better visibility
                }
            }
        },
        animation: false // Disable animations to avoid canvas issues
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
        <div style={{ height: '300px', width: '100%', position: 'relative' }}>
            {/* Each render gets a new canvas with a unique key */}
            <Line 
                key={`temp-chart-${Date.now()}`}
                data={displayData} 
                options={baseOptions}  // Use base options without double conversion
                ref={(reference) => {
                    // Store references for cleanup
                    chartRef.current = reference;
                    if (reference) {
                        chartInstanceRef.current = reference;
                    }
                }}
            />
        </div>
    );
};

export default MonthlyTemperatureChart;