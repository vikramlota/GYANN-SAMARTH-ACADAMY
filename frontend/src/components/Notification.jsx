import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api'; // Use your configured API
import { 
  FaArrowLeft, FaUniversity, FaPrint, FaCalendarAlt, 
  FaExternalLinkAlt, FaTag, FaWhatsapp, FaShare 
} from 'react-icons/fa';

const Notification = () => {
  const { id } = useParams(); // Grabs the ID from the URL
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        // Fetch specific update by ID
        const response = await api.get(`/notifications/${id}`);
        
        console.log("FETCHED DETAIL:", response.data); // Debugging

        // ROBUST DATA HANDLING: Check if data is nested or direct
        const data = response.data.data || response.data;
        
        if (data) {
            setUpdate(data);
        } else {
            setError("Update not found.");
        }

      } catch (err) {
        console.error("Error fetching update details:", err);
        setError("Could not load update details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpdate();
  }, [id]);

  // --- Share Functionality ---
  const shareNotification = () => {
    if (navigator.share) {
      navigator.share({
        title: update.title,
        text: update.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !update) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">{error || "Update not found"}</h2>
        <Link to="/notifications" className="text-brand-red hover:underline flex items-center">
            <FaArrowLeft className="mr-2"/> Back to Updates
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="relative bg-brand-red pt-24 pb-20 overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/notifications" className="inline-flex items-center py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs mb-4 tracking-wider uppercase hover:bg-white/20 transition-colors">
            <FaArrowLeft className="mr-1" /> Back to Updates
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 max-w-4xl mx-auto">{update.title}</h1>
          <p className="text-red-100 text-lg uppercase tracking-widest">{update.type || 'General'} UPDATE</p>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                {/* Card Top Bar */}
                <div className="bg-gray-900 p-4 md:p-6 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-red p-2 rounded-lg text-white"><FaUniversity className="text-lg md:text-xl"/></div>
                        <div>
                            <h2 className="text-white font-bold text-base md:text-lg leading-tight">Official Notification</h2>
                            <p className="text-gray-400 text-[10px] md:text-xs">ID: {update._id}</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors" onClick={() => window.print()}>
                        <FaPrint className="text-xl" title="Print this page"/>
                    </button>
                </div>

                {/* Content Body */}
                <div className="p-6 md:p-10 text-gray-700 leading-relaxed space-y-6">
                    
                    {/* Info Metadata Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex flex-wrap gap-6 items-center">
                        <div>
                            <h3 className="text-blue-800 font-bold mb-1 text-xs uppercase tracking-wide">Category</h3>
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <FaTag className="text-blue-400"/> {(update.type || 'Update').toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-blue-800 font-bold mb-1 text-xs uppercase tracking-wide">Posted On</h3>
                            <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                <FaCalendarAlt className="text-blue-400"/> 
                                {update.datePosted 
                                    ? new Date(update.datePosted).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                                    : 'Just Now'}
                            </div>
                        </div>
                    </div>

                    {/* Description Text */}
                    <div className="prose max-w-none text-gray-800 text-lg whitespace-pre-line">
                        {update.description}
                    </div>

                    {/* Image Attachment (If exists) */}
                    {update.imageUrl && (
                        <div className="mt-6 rounded-xl overflow-hidden shadow-md border border-gray-100">
                            <img src={update.imageUrl} alt={update.title} className="w-full h-auto object-cover" />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                    
                    {/* 1. Official Link Button */}
                    {update.linkUrl && (
                        <a href={update.linkUrl} target="_blank" rel="noopener noreferrer"
                           className="flex-1 bg-brand-red text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-red-800 transition-all flex items-center justify-center">
                            <FaExternalLinkAlt className="mr-2"/> View Official Source
                        </a>
                    )}

                    {/* 2. Share Button */}
                    <button onClick={shareNotification}
                            className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-gray-900 transition-all flex items-center justify-center">
                         <FaShare className="mr-2" /> Share
                    </button>

                    {/* 3. WhatsApp Button */}
                    <a href="https://wa.me/919988949969" target="_blank" rel="noreferrer"
                       className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-green-700 transition-all flex items-center justify-center">
                        <FaWhatsapp className="mr-2" /> Join Group
                    </a>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;