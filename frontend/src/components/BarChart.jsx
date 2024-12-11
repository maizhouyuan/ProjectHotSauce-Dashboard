import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  // 全部月份列表
  const allMonths = [
    '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11',
    '2024-12', // 中间的月份
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'
  ];

  // 创建一个对象，将所有月份初始化为0
  const monthDataMap = {};
  allMonths.forEach(month => {
    monthDataMap[month] = 0;
  });

  // 用实际数据覆盖默认值
  data.forEach(item => {
    if (monthDataMap[item.month] !== undefined) {
      monthDataMap[item.month] = item.value;
    }
  });

  // 提取 labels 和 values
  const labels = Object.keys(monthDataMap);
  const values = Object.values(monthDataMap);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'CO2 Level (ppm)',
        data: values,
        backgroundColor: values.map(value => {
          if (value <= 450) return 'green';
          if (value <= 700) return 'yellowgreen';
          if (value <= 1000) return 'yellow';
          if (value <= 2000) return 'orange';
          return 'red';
        }),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Yearly CO2 Levels' },
    },
    scales: {
      y: { title: { display: true, text: 'ppm' } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
