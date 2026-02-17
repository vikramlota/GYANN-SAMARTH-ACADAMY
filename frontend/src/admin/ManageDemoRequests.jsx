import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTrash, FaCheckCircle, FaWhatsapp, FaPhone } from 'react-icons/fa';

const ManageDemoRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/demo-requests');
      setRequests(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    (async () => {
      await fetchRequests();
    })();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Contacted' : (currentStatus === 'Contacted' ? 'Resolved' : 'Pending');
    try {
      await api.put(`/demo-requests/${id}`, { status: newStatus });
      fetchRequests(); // Refresh list
    } catch { alert("Failed to update status"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this request?")) {
      try {
        await api.delete(`/demo-requests/${id}`);
        setRequests(requests.filter(req => req._id !== id));
      } catch { alert("Failed to delete"); }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Demo Class Requests</h2>
      
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4">Date</th>
              <th className="p-4">Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Course</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold">{req.name} <br/><span className="text-xs font-normal text-gray-400">{req.email}</span></td>
                <td className="p-4">
                    <div className="flex gap-2">
                        <a href={`tel:${req.phone}`} className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded-full"><FaPhone/></a>
                        <a href={`https://wa.me/${req.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-700 p-2 bg-green-50 rounded-full"><FaWhatsapp/></a>
                    </div>
                </td>
                <td className="p-4 text-sm font-semibold">{req.courseInterested}</td>
                <td className="p-4">
                  <span onClick={() => handleStatusChange(req._id, req.status)} 
                        className={`cursor-pointer px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'Pending' ? 'bg-red-100 text-red-600' : (req.status === 'Contacted' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600')}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(req._id)} className="text-red-400 hover:text-red-600 p-2"><FaTrash/></button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDemoRequests;