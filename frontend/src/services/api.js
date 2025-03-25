import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sensorApi = {
  getAllSensors: async () => {
    try {
      const response = await api.get('/sensors');
      return response.data;
    } catch (error) {
      console.error('Error fetching sensors:', error);
      throw error;
    }
  },

  getSensorsByFloor: async (floor) => {
    try {
      const response = await api.get(`/sensors/floor/${floor}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensors for floor ${floor}:`, error);
      throw error;
    }
  },

  getSensorById: async (id) => {
    try {
      const response = await api.get(`/sensors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sensor ${id}:`, error);
      throw error;
    }
  }
};

export default api; 