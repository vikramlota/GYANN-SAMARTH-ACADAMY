import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/login', formData);
      const payload = response.data || {};
      // prefer `payload.token`, but accept `payload.data.token` as fallback
      const token = payload.token || payload.data?.token;
      const username = payload.username || payload.data?.username;

      if (!token) {
        setError('Login failed: token missing');
        return;
      }

      localStorage.setItem('adminToken', token);
      if (username) localStorage.setItem('adminUser', username);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-3 border rounded"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;