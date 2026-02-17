import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaUserGraduate, FaUserClock, FaPhone, FaWhatsapp, FaArrowRight } from 'react-icons/fa';

const Dashboard = () => {
  const [demoRequests, setDemoRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch demo requests
        const { data } = await api.get('/demo-requests');
        setDemoRequests(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats
  const pendingRequests = demoRequests.filter(req => req.status === 'Pending').length;
  // Get only the 5 most recent requests for the dashboard view
  const recentRequests = demoRequests.slice(0, 5);

  if (loading) return <div className="p-8 text-gray-500 font-bold">Loading Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-gray-800 mb-8">Admin Dashboard</h1>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Requests Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
                <FaUserGraduate />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Demos</p>
                <h3 className="text-3xl font-black text-gray-800">{demoRequests.length}</h3>
            </div>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 text-brand-red rounded-xl flex items-center justify-center text-2xl">
                <FaUserClock />
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pending Action</p>
                <h3 className="text-3xl font-black text-gray-800">{pendingRequests}</h3>
            </div>
        </div>
      </div>

      {/* --- RECENT DEMO REQUESTS TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Recent Demo Requests</h2>
            <Link to="/admin/demo-requests" className="text-brand-red font-bold text-sm hover:underline flex items-center gap-1">
                View All <FaArrowRight className="text-xs" />
            </Link>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Student Name</th>
                        <th className="p-4 font-bold">Course</th>
                        <th className="p-4 font-bold">Contact</th>
                        <th className="p-4 font-bold">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {recentRequests.map((req) => (
                        <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                            <td className="p-4 text-gray-500 whitespace-nowrap">
                                {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 font-bold text-gray-800">
                                {req.name} <br/><span className="text-xs font-normal text-gray-400">{req.email}</span>
                            </td>
                            <td className="p-4 font-semibold text-gray-700">
                                {req.courseInterested}
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <a href={`tel:${req.phone}`} className="text-blue-500 hover:bg-blue-100 p-2 bg-blue-50 rounded-full transition" title="Call">
                                        <FaPhone/>
                                    </a>
                                    <a href={`https://wa.me/${req.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-500 hover:bg-green-100 p-2 bg-green-50 rounded-full transition" title="WhatsApp">
                                        <FaWhatsapp/>
                                    </a>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                                    ${req.status === 'Pending' ? 'bg-red-100 text-red-600' : 
                                      req.status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' : 
                                      'bg-green-100 text-green-600'}`}>
                                    {req.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {recentRequests.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                                No demo requests yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;