import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import CurrentAffairs from '../components/CurrentAffairs.jsx';
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa';

const CurrentAffairsPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If no slug, show the current affairs list
  if (!slug) {
    return <CurrentAffairs />;
  }

  // Otherwise, show the article detail
  useEffect(() => {
    setLoading(true);
    api.get(`/updates/current-affairs/${slug}`)
       .then(res => {
         setArticle(res.data);
         setError('');
       })
       .catch(err => {
         console.error('Error fetching article:', err);
         setError('Article not found');
       })
       .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">{error || 'Article not found'}</h2>
        <Link to="/current-affairs" className="text-blue-600 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Current Affairs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Link to="/current-affairs" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <FaArrowLeft className="mr-2" /> Back to Current Affairs
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.headline} className="w-full h-96 object-cover" />
          )}
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex gap-4 items-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {article.category || 'General'}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(article.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 mb-6">{article.headline}</h1>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center">
                    <FaTag className="mr-1 text-gray-400" /> {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose max-w-none text-gray-800 text-lg leading-relaxed whitespace-pre-line">
              {article.contentBody}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAffairsPage;