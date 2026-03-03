import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaSearch, FaTag, FaBell } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to generate slug if not present
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Helper to strip HTML tags and decode entities to plain text
  const stripHtml = (html) => {
    if (!html) return '';
    try {
      const el = document.createElement('div');
      el.innerHTML = html;
      return el.textContent || el.innerText || '';
    } catch (e) {
      return String(html);
    }
  };

  // Categories for filtering
  const categories = ['All','Job', 'Admit', 'Result', 'New Notification', 'Exam Strategy', 'Exam Pattern', 'Cut-Off Analysis', 'Answer Key', 'Syllabus Update', 'Important Dates', 'General'];

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const { data } = await api.get('/notifications');
        
        // Add slug to each update item if not present
        const updatesWithSlugs = (Array.isArray(data) ? data : (data.data || [])).map(item => ({
          ...item,
          slug: item.slug || generateSlug(item.title)
        }));
        
        setUpdates(updatesWithSlugs);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  // Filter logic
  const filteredUpdates = updates.filter(item => {
    const matchesCategory = filter === 'All' || (item.type || 'Update')?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-brand-red font-bold text-xs uppercase mb-2">Stay Updated</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Latest <span className="text-brand-red">Notifications</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest exam notifications, results, and announcements. Essential for your exam preparation.</p>
        </div>

        {/* Controls: Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search updates..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
            </div>
        </div>

        {/* Updates Grid */}
        {loading ? (
             <div className="text-center py-20 text-gray-500">Loading updates...</div>
        ) : filteredUpdates.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <FaBell className="mx-auto text-4xl text-gray-300 mb-2"/>
                <p className="text-gray-500">No updates found for this category.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUpdates.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
    
    {/* Image */}
    <Link to={`/notifications/${item.slug}`} className="h-48 overflow-hidden relative block">
        <img 
            src={item.imageUrl || item.linkUrl || "https://placehold.co/600x400?text=Notification+Update"} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
            {item.type || 'Update'}
        </div>
    </Link>

    {/* Content */}
    <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-3">
            <FaCalendarAlt className="mr-1 text-brand-red"/>
            {new Date(item.datePosted || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
        
        {/* Title as Link */}
        <Link to={`/notifications/${item.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-brand-red transition-colors">
                {item.title}
            </h3>
        </Link>
        
        <p className="text-gray-600 text-sm line-clamp-4 mb-4 flex-grow">
            {stripHtml(item.description || item.contentBody)}
        </p>
    </div>
</div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default Updates;