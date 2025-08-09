import axios from 'axios';
import { backendUrl } from '../constants/config';

console.log('Axios - Using backend URL:', backendUrl);

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: backendUrl,
  timeout: 15000, // 15 seconds timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Making request to:', fullUrl);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - CORS or server unavailable');
    } else if (error.response?.status === 0) {
      console.error('Request failed - likely CORS issue');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { backendUrl };
