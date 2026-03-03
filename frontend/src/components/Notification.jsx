import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api'; 
import { 
  FaArrowLeft, FaUniversity, FaPrint, FaCalendarAlt, 
  FaExternalLinkAlt, FaTag, FaWhatsapp, FaShare 
} from 'react-icons/fa';

const Notification = () => {
  // Styles for rendered HTML content
  const htmlContentStyles = `
    .jodit-html-content p {
      margin-bottom: 1rem;
      line-height: 1.8;
    }
    .jodit-html-content h1, .jodit-html-content h2, .jodit-html-content h3,
    .jodit-html-content h4, .jodit-html-content h5, .jodit-html-content h6 {
      margin: 1.5rem 0 0.75rem 0;
      font-weight: bold;
      color: #1f2937;
    }
    .jodit-html-content h1 { font-size: 1.875rem; }
    .jodit-html-content h2 { font-size: 1.5rem; }
    .jodit-html-content h3 { font-size: 1.25rem; }
    .jodit-html-content ul, .jodit-html-content ol {
      margin-bottom: 1rem;
      margin-left: 2rem;
    }
    .jodit-html-content li {
      margin-bottom: 0.5rem;
      line-height: 1.8;
    }
    .jodit-html-content strong { font-weight: 600; }
    .jodit-html-content em { font-style: italic; }
    .jodit-html-content a {
      color: #dc2626;
      text-decoration: underline;
    }
    .jodit-html-content a:hover { color: #b91c1c; }
    .jodit-html-content blockquote {
      border-left: 4px solid #dc2626;
      padding-left: 1rem;
      margin: 1rem 0;
      font-style: italic;
      color: #6b7280;
    }
    .jodit-html-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    .jodit-html-content th, .jodit-html-content td {
      border: 1px solid #e5e7eb;
      padding: 0.75rem;
      text-align: left;
    }
    .jodit-html-content th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    .jodit-html-content img {
      max-width: 100%;
      height: auto;
      border-radius: 0.75rem;
      margin: 1rem 0;
    }
  `;
  
  // CHANGED: Get 'slug' from URL instead of 'id'
  const { slug } = useParams(); 
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        console.log("Fetching with slug:", slug);
        // CHANGED: Fetch by slug (Ensure your backend supports GET /notifications/:slug)
        const response = await api.get(`/notifications/${slug}`);
        
        console.log("API Response status:", response.status);
        console.log("FETCHED DETAIL:", response.data); 

        const data = response.data.data || response.data;
        console.log("Processed data:", data);
        
        if (data) {
            setUpdate(data);
        } else {
            setError("Update not found.");
        }

      } catch (err) {
        console.error("Error fetching update details:", err);
        console.error("Error response:", err.response);
        setError("Could not load update details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchUpdate();
  }, [slug]);

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

  // Build a YouTube embed URL from various possible inputs (full URL, youtu.be, or ID)
  const getYoutubeEmbedSrc = (value) => {
    if (!value) return null;
    try {
      // If value already looks like an embed URL, return it
      if (value.includes('youtube.com/embed') || value.includes('youtube-nocookie.com/embed')) return value;

      // If it's a youtu.be short link
      if (value.includes('youtu.be')) {
        const id = value.split('/').pop().split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }

      // If it's a full youtube URL with v= param
      if (value.includes('youtube.com')) {
        const u = new URL(value);
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
      }

      // Otherwise assume it's a raw video id
      const possibleId = value.trim();
      if (possibleId.length >= 8 && possibleId.length <= 64) return `https://www.youtube.com/embed/${possibleId}`;
    } catch (e) {
      // fallback
    }
    return null;
  };

  // Ensure URL is absolute (handles relative paths returned by some APIs)
  const normalizeUrl = (url) => {
    if (!url) return '';
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.href;
    } catch (e) {
      return url;
    }
  };

  const isPdf = (url) => {
    if (!url) return false;
    return url.split('?')[0].toLowerCase().endsWith('.pdf');
  };

  const shareNotification = () => {
    if (navigator.share) {
      navigator.share({
        title: update?.title,
        text: update?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
    <>
      <style>{htmlContentStyles}</style>
      <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <Helmet>
            <title>{update.title} | Samarth Academy</title>
            {/* Strip HTML tags for the description and limit to 160 chars */}
            <meta name="description" content={update.description?.replace(/<[^>]+>/g, '').substring(0, 160)} />
          </Helmet>
      <header className="relative bg-brand-red pt-24 pb-20 overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/notifications" className="inline-flex items-center py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs mb-4 tracking-wider uppercase hover:bg-white/20 transition-colors">
            <FaArrowLeft className="mr-1" /> Back to Updates
          </Link>
          {/* Main Page Title */}
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
                            {/* <p className="text-gray-400 text-[10px] md:text-xs">Slug: {update?.slug}</p> */}
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

                    {/* NEW: Title inside Body (Bold as requested) */}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {update.title}
                    </h2>

                    {/* Image Attachment (If exists) - centered, with caption and lazy loading */}
                    {(update.imageUrl || update.linkUrl) && (
                      <div className="mt-6">
                        {/* Prefer explicit imageUrl, fallback to linkUrl */}
                        {isPdf(update.imageUrl || update.linkUrl) ? (
                          <div className="rounded-xl overflow-hidden shadow-md border border-gray-100">
                            <object data={normalizeUrl(update.imageUrl || update.linkUrl)} type="application/pdf" width="100%" height="600">
                              <p className="p-6 text-center text-gray-600">PDF preview not available. <a href={normalizeUrl(update.imageUrl || update.linkUrl)} target="_blank" rel="noreferrer" className="text-brand-red underline">Open PDF</a></p>
                            </object>
                            {(update.imageCaption || update.imageAlt) && (
                              <div className="text-sm text-gray-500 p-3">{update.imageCaption || update.imageAlt}</div>
                            )}
                          </div>
                        ) : (
                          <figure className="rounded-xl overflow-hidden shadow-md border border-gray-100">
                            <img src={normalizeUrl(update.imageUrl || update.linkUrl)} alt={update.imageAlt || update.title} loading="lazy" className="w-full h-auto object-cover" />
                            {(update.imageCaption || update.imageAlt) && (
                              <figcaption className="text-sm text-gray-500 p-3">{update.imageCaption || update.imageAlt}</figcaption>
                            )}
                          </figure>
                        )}
                      </div>
                    )}

                    {/* Description Text (rendered as formatted HTML) */}
                    <div 
                      className="jodit-html-content prose prose-sm max-w-none text-gray-800"
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                      dangerouslySetInnerHTML={{ __html: update.description }}
                    />

                    {/* Optional YouTube Video (if provided) */}
                    {(() => {
                      const vid = update.youtubeUrl || update.videoUrl || update.videoId || update.video;
                      const embed = getYoutubeEmbedSrc(vid);
                      if (!embed) return null;
                      return (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-3">Video</h3>
                          <div className="relative" style={{ paddingTop: '56.25%' }}>
                            <iframe
                              title="Notification Video"
                              src={`${embed}?rel=0`}
                              className="absolute inset-0 w-full h-full rounded-lg border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        </div>
                      );
                    })()}
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
                    <a href="https://wa.me/919041973105" target="_blank" rel="noreferrer"
                       className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-green-700 transition-all flex items-center justify-center">
                        <FaWhatsapp className="mr-2" /> Join Group
                    </a>
                </div>

            </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default Notification;