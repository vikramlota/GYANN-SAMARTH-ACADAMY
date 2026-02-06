import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaCalendarAlt, FaSearch, FaTag, FaNewspaper } from 'react-icons/fa';

const CurrentAffairs = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Categories for filtering
  const categories = ['All', 'National', 'International', 'Sports', 'Science', 'Economy'];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Assuming your backend route is /api/current-affairs
        // If it is inside updates, change to /api/updates/current-affairs
        const { data } = await api.get('/updates/current-affairs'); 
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter logic
  const filteredNews = news.filter(item => {
    const matchesCategory = filter === 'All' || (item.category || 'General') === filter;
    const matchesSearch = item.headline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase mb-2">Daily Updates</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Current <span className="text-blue-600">Affairs</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest happenings in the world. Essential for your exam preparation.</p>
        </div>

        {/* Controls: Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                    placeholder="Search news..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        {/* News Grid */}
        {loading ? (
             <div className="text-center py-20 text-gray-500">Loading News...</div>
        ) : filteredNews.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <FaNewspaper className="mx-auto text-4xl text-gray-300 mb-2"/>
                <p className="text-gray-500">No news found for this category.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                        {/* Image */}
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={item.imageUrl || "https://placehold.co/600x400?text=News+Update"} 
                                alt={item.headline} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                                {item.category || 'General'}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                                <FaCalendarAlt className="mr-1 text-blue-400"/>
                                {new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-blue-600 transition-colors">
                                {item.headline}
                            </h3>
                            
                            <p className="text-gray-600 text-sm line-clamp-4 mb-4 flex-grow">
                                {item.contentBody || item.description}
                            </p>

                            <button className="w-full mt-auto border border-blue-100 bg-blue-50 text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm">
                                Read Full Story
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};

export default CurrentAffairs;