import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});


// Mocking the backend delay and responses
api.interceptors.request.use(async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
