import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Ensure this points to your utils/api.js
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaClock, FaArrowRight, FaFilter } from 'react-icons/fa';

const Updates = () => {
  const [filter, setFilter] = useState('all');
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await api.get('/notifications');
        
        // ROBUST DATA HANDLING
        // This grabs the array whether it's direct [] or nested inside { data: [] }
        const rawData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);

        console.log("FINAL UPDATES LIST:", rawData); // Check Console to see if this has items
        setUpdates(rawData);

      } catch (error) {
        console.error('Error fetching updates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const getColor = (type) => {
    // Robust lowercasing to match "Job", "JOB", or "job"
    const safeType = (type || '').toLowerCase();
    switch (safeType) {
      case 'job': return 'bg-green-500';
      case 'admit': return 'bg-blue-500';
      case 'result': return 'bg-brand-orange';
      default: return 'bg-gray-500';
    }
  };

  const getBadge = (type) => {
    const safeType = (type || '').toLowerCase();
    switch (safeType) {
      case 'job': return { color: 'bg-green-100 text-green-700', text: 'Exam' };
      case 'admit': return { color: 'bg-blue-100 text-blue-700', text: 'Admit Card' };
      case 'result': return { color: 'bg-orange-100 text-brand-orange', text: 'Result Declared' };
      default: return { color: 'bg-gray-100 text-gray-700', text: 'Update' };
    }
  };

  // 1. Process data securely
  const updatesData = updates.map(update => ({
    id: update._id,
    type: update.type || 'other',
    date: update.datePosted 
      ? new Date(update.datePosted).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
      : 'Just Now',
    title: update.title || 'Untitled Update',
    desc: update.description || 'No description provided.',
    color: getColor(update.type),
    badgeColor: getBadge(update.type).color,
    badgeText: getBadge(update.type).text,
    // Add raw type for filtering comparison
    rawType: (update.type || '').toLowerCase() 
  }));

  // 2. Filter logic (Case Insensitive)
  const filteredUpdates = filter === 'all' 
    ? updatesData 
    : updatesData.filter(item => item.rawType === filter.toLowerCase());

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="relative bg-brand-red pt-16 pb-20 text-center">
        <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Latest Notifications</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4">
           <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center"><FaFilter className="mr-2"/> Filters</h3>
              <div className="space-y-2">
                 {['all', 'job', 'admit', 'result'].map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={`w-full text-left px-4 py-2 rounded-lg capitalize font-medium transition-colors ${filter === cat ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
                   >
                     {cat === 'all' ? 'All Updates' : cat}
                   </button>
                 ))}
              </div>
           </div>
        </aside>

        {/* Main Feed */}
        <div className="lg:w-3/4 grid gap-6">
           
           {/* DEBUG MESSAGE if list is empty */}
           {filteredUpdates.length === 0 && (
             <div className="text-center py-10 bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-400">
                <h3 className="text-xl font-bold text-gray-800">No updates found</h3>
                <p className="text-gray-600">
                   We fetched {updates.length} items from the server, but 0 matched the category "{filter}".
                </p>
                <button onClick={() => setFilter('all')} className="mt-4 text-brand-red underline">Show All</button>
             </div>
           )}

           {filteredUpdates.map((item) => (
             <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`${item.badgeColor} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide`}>{item.badgeText}</span>
                         <span className="text-gray-400 text-xs flex items-center"><FaClock className="mr-1"/> {item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.desc}</p>
                   </div>
                   <div className="shrink-0">
                      {/* FIX: Link to the correct ID path */}
                      <Link to={`/notifications/${item.id}`} className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-red-50 text-brand-red font-bold rounded-xl border border-red-100 hover:bg-brand-red hover:text-white transition-all">
                         View Details <FaArrowRight className="ml-2"/>
                      </Link>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default Updates;