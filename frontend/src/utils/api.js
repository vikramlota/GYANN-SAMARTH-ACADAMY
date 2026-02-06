import axios from 'axios';

// 1. Point specifically to the /api folder
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // <--- MAKE SURE THIS SAYS /api
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