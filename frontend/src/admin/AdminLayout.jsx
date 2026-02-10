import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4">
        <div className="mb-6 font-bold text-lg">Admin</div>
        <nav className="flex flex-col gap-2 text-sm ">
          <a href="/admin/dashboard" className="text-gray-700 hover:underline">Dashboard</a>
          <a href="/admin/courses" className="text-gray-700 hover:underline">Manage Courses</a>
          <a href="/admin/updates" className="text-gray-700 hover:underline">Manage Updates</a>
          <a href="/admin/results" className="text-gray-700 hover:underline">Manage Results</a>
          <a href="/admin/current-affairs" className="text-gray-700 hover:underline">Manage Current Affairs</a>
        </nav>
        <button onClick={handleLogout} className="mt-6 text-red-600">Logout</button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;