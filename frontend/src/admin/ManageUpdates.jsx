import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import JoditEditor from 'jodit-react';
import { FaTrash, FaBell, FaUpload, FaEdit, FaTimes } from 'react-icons/fa';

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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaBell className="text-yellow-500"/> Manage Notifications</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FORM - 50% width */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{editingId ? 'Edit Update' : 'Post New Update'}</h3>
            {editingId && (
              <button 
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '', type: 'job', linkUrl: '', isLatest: true });
                  setImageFile(null);
                  setExistingImage(null);
                }} 
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
               <input name="title" value={formData.title} onChange={(e)=>setFormData({...formData, title:e.target.value})} placeholder="Title (e.g. SBI PO Out)" required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none"/>
             </div>
             
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
               <select name="type" value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})} className="w-full border p-2 rounded bg-white">
                  <option value="Job">New Job</option>
                  <option value="Admit Card Update">Admit Card Update</option>
                  <option value="Result">Result Declared</option>
                  <option value="New Notification">New Notification</option>
                  <option value="Exam Strategy">Exam Strategy</option>
                  <option value="Exam Pattern">Exam Pattern</option>
                  <option value="Cut-Off Analysis">Cut-Off Analysis</option>
                  <option value="Answer Key">Answer Key</option>
                  <option value="Syllabus Update">Syllabus Update</option>
                  <option value="Important Dates">Important Dates</option>
                  <option value="General">General</option>
                  
               </select>
             </div>
             

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
             
             <div>
               <label className="text-xs font-bold text-gray-500 uppercase">Official Link (Optional)</label>
               <input name="linkUrl" value={formData.linkUrl} onChange={(e)=>setFormData({...formData, linkUrl:e.target.value})} placeholder="https://example.com" className="w-full border p-2 rounded"/>
             </div>
             
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Image {editingId && '(Leave empty to keep existing)'}</label>
                  <div className="border border-dashed p-2 rounded flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                    <FaUpload className="text-gray-400"/>
                    <input type="file" accept="image/*,application/pdf" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm"/>
                  </div>
                  {existingImage && !imageFile && (
                    <p className="text-xs text-gray-500 mt-2">Current: <a href={existingImage} target="_blank" rel="noreferrer" className="underline">View</a></p>
                  )}
                  {imageFile && (
                    <p className="text-xs text-gray-500 mt-2">Selected: {imageFile.name}</p>
                  )}
             </div>

             <button disabled={isSubmitting} className={`w-full text-white py-2 rounded font-bold transition disabled:bg-gray-400 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
               {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Post Update')}
             </button>
          </form>
        </div>

        {/* LIST - 50% width */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Updates ({updates.length})</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {updates.map(item => (
             <div key={item._id} className={`p-4 rounded-lg border transition ${editingId === item._id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-gray-50 hover:shadow-md'}`}>
               <div className="flex justify-between items-start gap-3">
                 <div className="flex-grow overflow-hidden">
                   <span className={`text-xs font-bold px-2 py-1 rounded uppercase inline-block ${item.type==='job'?'bg-green-100 text-green-700': item.type==='result'?'bg-orange-100 text-orange-700':'bg-blue-100 text-blue-700'}`}>
                     {item.type}
                   </span>
                   <h4 className="font-bold mt-2 text-gray-900 line-clamp-2">{item.title}</h4>
                   <p className="text-xs text-gray-500 mt-1">{new Date(item.datePosted || Date.now()).toLocaleDateString()}</p>
                 </div>
                 <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => {
                     setFormData({ title: item.title || '', description: item.description || '', type: (item.type || 'job').toLowerCase(), linkUrl: item.linkUrl || '', isLatest: item.isLatest ?? true });
                     setEditingId(item._id);
                     setExistingImage(item.imageUrl || null);
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} className="text-blue-500 hover:text-blue-700 p-2 bg-blue-50 rounded hover:bg-blue-100 transition">
                    <FaEdit />
                  </button>
                  <button type="button" onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded hover:bg-red-100 transition"><FaTrash/></button>
                 </div>
               </div>
             </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUpdates;