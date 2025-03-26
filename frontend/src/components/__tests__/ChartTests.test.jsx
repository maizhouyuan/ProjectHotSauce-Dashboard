import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BarChart from '../BarChart';
import LineChart from '../LineChart';
import { vi } from 'vitest';

// Mock Chart.js to avoid canvas-related issues in tests
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
  Line: () => <div data-testid="mock-line-chart">Line Chart</div>,
}));

describe('BarChart Component', () => {
  const mockData = [
    { month: 'January', value: 400 },
    { month: 'February', value: 600 },
    { month: 'March', value: 800 },
  ];

  test('renders without crashing', () => {
    render(<BarChart data={mockData} />);
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  test('displays "No data available" when no data is provided', () => {
    render(<BarChart data={null} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('displays "No valid data available" when data is invalid', () => {
    const invalidData = [
      { month: 'January', value: -1 },
      { month: 'February', value: 'invalid' },
    ];
    render(<BarChart data={invalidData} />);
    expect(screen.getByText('No valid data available')).toBeInTheDocument();
  });
});

describe('LineChart Component', () => {
  const mockData = [
    { month: 'January', avgTemperature: 20 },
    { month: 'February', avgTemperature: 25 },
    { month: 'March', avgTemperature: 30 },
  ];

  test('renders without crashing', () => {
    render(<LineChart data={mockData} />);
    expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
  });

  test('displays "No data available" when no data is provided', () => {
    render(<LineChart data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  test('renders temperature unit toggle buttons', () => {
    render(<LineChart data={mockData} />);
    expect(screen.getByText('Celsius (°C)')).toBeInTheDocument();
    expect(screen.getByText('Fahrenheit (°F)')).toBeInTheDocument();
  });

  test('disables current unit button', () => {
    render(<LineChart data={mockData} />);
    const celsiusButton = screen.getByText('Celsius (°C)');
    expect(celsiusButton).toBeDisabled();
    expect(celsiusButton).toHaveStyle({ cursor: 'not-allowed' });
  });
}); 