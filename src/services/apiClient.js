import axios from 'axios';

// Simple API client for localhost development with proxy
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Point directly to the API server
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add timestamp to prevent caching
apiClient.interceptors.request.use(
  (config) => {
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}_=${Date.now()}`;
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Log errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 