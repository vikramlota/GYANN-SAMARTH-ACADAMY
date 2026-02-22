import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import JoditEditor from 'jodit-react';
import { FaTrash, FaBell, FaUpload } from 'react-icons/fa';

const ManageUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editor = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'job', linkUrl: '' , isLatest: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Jodit Editor Configuration
  const editorConfig = {
    readonly: false,
    height: 400,
    placeholder: 'Write your current affairs update here...',

   
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_as_html',
   
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'table', 'link', 'image', '|', // Includes the table tool
      'align', 'undo', 'redo', 'source'
    ]
  };


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
    // Debug: log FormData entries to ensure file is attached
    try {
      for (const pair of data.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      // Force multipart/form-data for this request to ensure proper boundary header
      if (editingId) {
        await api.put(`/notifications/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/notifications', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      alert('Update Posted!');
      setFormData({ title: '', description: '', type: 'job', linkUrl: '', isLatest: true });
      setImageFile(null);
      setEditingId(null);
      setExistingImage(null);
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
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
             <input name="title" value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} placeholder="Title (e.g. SBI PO Out)" required className="w-full border p-2 rounded"/>
             
             <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})} className="w-full border p-2 rounded">
                <option value="job">New Job</option>
                <option value="admit">Admit Card</option>
                <option value="result">Result Declared</option>
             </select>

             <div>
               <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Description</label>
               <JoditEditor
                 ref={editor}
                 value={formData.description}
                 config={editorConfig}
                 onBlur={(newContent) => setFormData({...formData, description: newContent})}
                 onChange={(newContent) => {}}
               />
             </div>
             
             <input name="linkUrl" value={formData.linkUrl} onChange={(e)=>setFormData({...formData, linkUrl:e.target.value})} placeholder="Official Link (Optional)" className="w-full border p-2 rounded"/>
             
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Image {editingId && '(Leave empty to keep existing)'}</label>
                  <div className="border border-dashed p-2 rounded flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                    <FaUpload className="text-gray-400"/>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm"/>
                  </div>
                  {existingImage && !imageFile && (
                    <p className="text-xs text-gray-500 mt-2">Current attachment: <a href={existingImage} target="_blank" rel="noreferrer" className="underline">View</a></p>
                  )}
                  {imageFile && (
                    <p className="text-xs text-gray-500 mt-2">Selected: {imageFile.name}</p>
                  )}
             </div>

             <button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
               {isSubmitting ? 'Posting...' : 'Post Update'}
             </button>
          </form>
        </div>

        {/* LIST */}
          <div className="lg:col-span-2">
            {updates.map(item => (
             <div key={item._id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
               <div>
                 <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.type==='job'?'bg-green-100 text-green-700': item.type==='result'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>
                   {item.type}
                 </span>
                 <h4 className="font-bold mt-1">{item.title}</h4>
                 <p className="text-xs text-gray-500">{new Date(item.datePosted || Date.now()).toLocaleDateString()}</p>
               </div>
               <div className="flex items-center gap-2">
                <button onClick={() => {
                   // populate form for editing
                   setFormData({ title: item.title || '', description: item.description || '', type: (item.type || 'job').toLowerCase(), linkUrl: item.linkUrl || '', isLatest: item.isLatest ?? true });
                   setEditingId(item._id);
                   setExistingImage(item.imageUrl || null);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} className="text-blue-600 p-2 hover:bg-blue-50 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-500 p-2 hover:bg-red-50 rounded"><FaTrash/></button>
               </div>
             </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default ManageUpdates;