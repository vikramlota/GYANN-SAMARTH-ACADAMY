import axios from 'axios';

// 1. Use environment variable for API URL
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const normalizedBase = rawUrl.endsWith('/api') ? rawUrl : rawUrl.replace(/\/+$/, '') + '/api';
console.log('API baseURL:', normalizedBase);
const api = axios.create({
  baseURL: normalizedBase,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 2. Automatically attach token IF it exists (for Admin pages)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    // If sending FormData (file upload), remove forced JSON header so
    // the browser/axios can set multipart/form-data with boundary.
    if (config.data && typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;