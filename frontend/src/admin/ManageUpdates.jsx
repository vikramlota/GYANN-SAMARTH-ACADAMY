import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTrash, FaBell, FaUpload } from 'react-icons/fa';

const ManageUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'job', linkUrl: '' , isNew: true
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchUpdates = async () => {
    try {
      const { data } = await api.get('/notifications');
      // Handle { data: [...] } vs [...]
      setUpdates(Array.isArray(data) ? data : (data.data || []));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      await api.post('/notifications', data);
      alert('Update Posted!');
      setFormData({ title: '', description: '', type: 'job', linkUrl: '', isNew: true });
      setImageFile(null);
      fetchUpdates();
    } catch (error) { 
      console.error("Error posting update:", error.response?.data || error.message || error);
      alert('Failed to post update. See console for details.'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this update?")) {
      await api.delete(`/notifications/${id}`);
      setUpdates(updates.filter(u => u._id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaBell className="text-yellow-500"/> Manage Notifications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow border h-fit">
          <form onSubmit={handleSubmit} className="space-y-4">
             <input name="title" value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} placeholder="Title (e.g. SBI PO Out)" required className="w-full border p-2 rounded"/>
             
             <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})} className="w-full border p-2 rounded">
                <option value="job">New Job</option>
                <option value="admit">Admit Card</option>
                <option value="result">Result Declared</option>
             </select>

             <textarea name="description" value={formData.description} onChange={(e)=>setFormData({...formData, description:e.target.value})} placeholder="Details..." rows="3" className="w-full border p-2 rounded"/>
             <input name="linkUrl" value={formData.linkUrl} onChange={(e)=>setFormData({...formData, linkUrl:e.target.value})} placeholder="Official Link (Optional)" className="w-full border p-2 rounded"/>
             
             <div className="border border-dashed p-2 rounded">
                <input type="file" onChange={(e)=>setImageFile(e.target.files[0])} className="w-full text-sm"/>
             </div>

             <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
               {isSubmitting ? 'Posting...' : 'Post Update'}
             </button>
          </form>
        </div>

        {/* LIST */}
        <div className="md:col-span-2 space-y-4">
           {updates.map(item => (
             <div key={item._id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
                <div>
                   <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.type==='job'?'bg-green-100 text-green-700': item.type==='result'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>
                      {item.type}
                   </span>
                   <h4 className="font-bold mt-1">{item.title}</h4>
                   <p className="text-xs text-gray-500">{new Date(item.datePosted || Date.now()).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><FaTrash/></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUpdates;