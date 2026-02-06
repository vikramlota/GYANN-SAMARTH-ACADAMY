import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTrash, FaEdit, FaNewspaper, FaUpload, FaTimes } from 'react-icons/fa';

const ManageCurrentAffairs = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to track if we are editing
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    headline: '',
    contentBody: '',
    category: 'National',
    tags: '',
    isSpotlight: 'false'
  });

  // 1. Fetch News
  const fetchNews = async () => {
    try {
      const { data } = await api.get('/current-affairs'); // Check route path
      setNewsList(data);
    } catch (error) {
      console.error("Error loading news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 2. Populate Form for Editing
  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      headline: item.headline,
      contentBody: item.contentBody,
      category: item.category,
      tags: item.tags ? item.tags.join(', ') : '',
      isSpotlight: item.isSpotlight ? 'true' : 'false'
    });
    // We scroll to top to see the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ headline: '', contentBody: '', category: 'National', tags: '', isSpotlight: 'false' });
    setImageFile(null);
  };

  // 4. Submit Logic (Create OR Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('headline', formData.headline);
    data.append('contentBody', formData.contentBody);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('isSpotlight', formData.isSpotlight);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        // UPDATE EXISTING (PUT)
        await api.put(`/current-affairs/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('News Updated Successfully!');
      } else {
        // CREATE NEW (POST)
        await api.post('/current-affairs', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('News Posted Successfully!');
      }

      handleCancelEdit(); // Reset form
      fetchNews(); // Refresh list
    } catch (error) {
      console.error(error);
      alert('Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Delete this news article?")) {
      try {
        await api.delete(`/current-affairs/${id}`);
        setNewsList(newsList.filter(n => n._id !== id));
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaNewspaper className="text-blue-600"/> Manage Current Affairs
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Add/Edit Form */}
        <div className="lg:col-span-1">
            <div className={`bg-white p-6 rounded-xl shadow-lg border sticky top-4 ${editingId ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-gray-100'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                        {editingId ? 'Edit Article' : 'Post New Article'}
                    </h3>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
                            <FaTimes/> Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Headline</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.headline}
                            onChange={(e) => setFormData({...formData, headline: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select 
                            className="w-full border p-2 rounded bg-white"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="National">National</option>
                            <option value="International">International</option>
                            <option value="Sports">Sports</option>
                            <option value="Science">Science & Tech</option>
                            <option value="Economy">Economy</option>
                            <option value="Tech">Tech</option>
                            <option value="Awards">Awards</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Tags (Comma separated)</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded" 
                            placeholder="e.g. Budget, Finance"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Content</label>
                        <textarea 
                            rows="6"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.contentBody}
                            onChange={(e) => setFormData({...formData, contentBody: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Image {editingId && '(Leave empty to keep existing)'}</label>
                        <div className="border border-dashed p-2 rounded flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                            <FaUpload className="text-gray-400"/>
                            <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm"/>
                        </div>
                    </div>

                    <button disabled={isSubmitting} className={`w-full text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {isSubmitting ? 'Saving...' : (editingId ? 'Update Article' : 'Publish News')}
                    </button>
                </form>
            </div>
        </div>

        {/* RIGHT: List of News */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-4">Published Articles ({newsList.length})</h3>
                
                {loading ? <p>Loading...</p> : (
                    <div className="space-y-4">
                        {newsList.map(item => (
                            <div key={item._id} className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-lg transition bg-gray-50 ${editingId === item._id ? 'border-yellow-400 ring-1 ring-yellow-200' : 'border-gray-100 hover:shadow-md'}`}>
                                <img 
                                    src={item.imageUrl || "https://placehold.co/100"} 
                                    alt="thumb" 
                                    className="w-full sm:w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 line-clamp-2">{item.headline}</h4>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(item)} 
                                                className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded hover:bg-blue-100 transition"
                                                title="Edit"
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id)} 
                                                className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded hover:bg-red-100 transition"
                                                title="Delete"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        {item.isSpotlight && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Spotlight</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.contentBody}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ManageCurrentAffairs;