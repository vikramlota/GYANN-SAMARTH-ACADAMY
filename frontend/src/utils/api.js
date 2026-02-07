import axios from 'axios';

// 1. Use environment variable for API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://samarthacadamy-one.vercel.app/api',
  withCredentials: true
});

// 2. Automatically attach token IF it exists (for Admin pages)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;