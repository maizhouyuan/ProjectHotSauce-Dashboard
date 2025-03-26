import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SensorChart = ({ data, title, yLabel, color, temperatureUnit }) => {
    const convertTemperature = (celsius) => {
        if (temperatureUnit === 'F') {
            return (celsius * 9/5) + 32;
        }
        return celsius;
    };

    const chartData = {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: yLabel,
                data: data.map(d => yLabel === 'Temperature' ? convertTemperature(d[yLabel.toLowerCase()]) : d[yLabel.toLowerCase()]),
                borderColor: color,
                backgroundColor: color + '20',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `${title}${yLabel === 'Temperature' ? ` (°${temperatureUnit})` : ''}`,
                color: '#333',
                font: {
                    size: 14
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let value = context.parsed.y;
                        if (yLabel === 'Temperature') {
                            return `${value.toFixed(1)}°${temperatureUnit}`;
                        } else if (yLabel === 'CO2') {
                            return `${value} ppm`;
                        }
                        return value;
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
                        if (yLabel === 'Temperature') {
                            return `${value}°${temperatureUnit}`;
                        } else if (yLabel === 'CO2') {
                            return `${value} ppm`;
                        }
                        return value;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <div style={{ height: '200px', marginBottom: '20px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default SensorChart; 