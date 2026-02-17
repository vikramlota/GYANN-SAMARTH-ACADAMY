import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { FaArrowLeft, FaCalendarAlt, FaShare, FaNewspaper, FaTags } from 'react-icons/fa';

const CurrentAffairsDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        console.log("🔍 Fetching article with slug:", slug);
        // Fetch specific current affair by slug
        const response = await api.get(`/current-affairs/${slug}`);
        
        console.log("✅ Article response:", response.data);
        
        // Handle nested data structures gracefully
        const data = response.data.data || response.data;
        const articleData = Array.isArray(data) ? data[0] : data;

        if (articleData) {
            console.log("📄 Article data:", articleData);
            setArticle(articleData);
        } else {
            console.error("❌ No article data found");
            setError("Article not found.");
        }
      } catch (err) {
        console.error("❌ Error fetching current affair:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Could not load the article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
  }, [slug]);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.headline,
        text: `Read about ${article?.headline} on Samarth Academy`,
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
            <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">{error || "Article not found"}</h2>
        <Link to="/current-affairs" className="text-brand-red hover:underline flex items-center">
            <FaArrowLeft className="mr-2"/> Back to Current Affairs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      
      {/* Header Section */}
      <header className="relative bg-brand-red pt-24 pb-20 overflow-hidden">
        {/* Background Overlay Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <Link to="/current-affairs" className="inline-flex items-center py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs mb-6 tracking-wider uppercase hover:bg-white/20 transition-colors">
            <FaArrowLeft className="mr-2" /> All Current Affairs
          </Link>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            {article.headline}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm font-medium mt-6">
             <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                 <FaCalendarAlt className="text-brand-orange"/> 
                 {new Date(article.date || article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
             </span>
             {article.category && (
                 <span className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm uppercase tracking-wide">
                     <FaTags className="text-brand-orange"/> {article.category}
                 </span>
             )}
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <main className="container mx-auto px-4 max-w-4xl -mt-10 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* Top Bar indicating it's News/Current Affairs */}
            <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <FaNewspaper className="text-lg"/>
                    </div>
                    <h2 className="text-white font-bold tracking-widest text-sm uppercase">Daily Update</h2>
                </div>
            </div>

            {/* Article Body */}
            <div className="p-6 md:p-10">
                {/* Optional Image */}
                {article.imageUrl && (
                    <div className="mb-8 rounded-xl overflow-hidden shadow-md">
                        <img src={article.imageUrl} alt={article.headline} className="w-full h-auto max-h-[400px] object-cover" />
                    </div>
                )}

                {/* Content Text */}
                <div 
                    className="jodit-html-content text-gray-800 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: article.contentBody }} 
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                />
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center">
                <button 
                    onClick={shareArticle}
                    className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    <FaShare className="text-brand-red" /> Share This Article
                </button>
            </div>
            
        </div>
      </main>
    </div>
  );
};

export default CurrentAffairsDetailPage;