import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { FaTrash, FaPlus, FaBook, FaUpload, FaPalette, FaList, FaEdit, FaTimes } from 'react-icons/fa';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  // NEW: State to track which course we are editing
  const [editingId, setEditingId] = useState(null);
  
  // Ref to clear file input manually
  const fileInputRef = useRef(null);
  
  const [currentFeature, setCurrentFeature] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'SSC',
    badgeText: '',
    colorTheme: 'red',
    features: []
  });

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) { console.error("Error loading courses", err); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only auto-generate slug if NOT in edit mode (don't change existing slugs accidentally)
    if (name === 'title' && !editingId) {
      const generatedSlug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setFormData({ ...formData, title: value, slug: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, currentFeature] });
      setCurrentFeature('');
    }
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // --- NEW: Handle Edit Click ---
  const handleEdit = (course) => {
    setEditingId(course._id);
    
    // Reverse-engineer the color theme string from the object for the UI
    let themeString = 'red';
    if (course.colorTheme?.text?.includes('blue')) themeString = 'blue';
    if (course.colorTheme?.text?.includes('green')) themeString = 'green';

    setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description,
        category: course.category,
        badgeText: course.badgeText || '',
        colorTheme: themeString,
        features: course.features || []
    });
    
    // Clear image file state (user has to upload new one if they want to change it)
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- NEW: Cancel Edit ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', description: '', category: 'SSC', badgeText: '', colorTheme: 'red', features: [] });
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 1. Create FormData (This part is fine)
    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('badgeText', formData.badgeText);
    
    // Features loop
    formData.features.forEach((feat, index) => {
        data.append(`features[${index}]`, feat);
    });

    // Theme logic
    let themeObj = { from: 'from-brand-red', to: 'to-orange-600', text: 'text-brand-red', border: 'border-brand-red' };
    if (formData.colorTheme === 'blue') {
        themeObj = { from: 'from-blue-600', to: 'to-cyan-500', text: 'text-blue-600', border: 'border-blue-600' };
    } else if (formData.colorTheme === 'green') {
        themeObj = { from: 'from-green-600', to: 'to-emerald-500', text: 'text-green-600', border: 'border-green-600' };
    }
    data.append('colorTheme[from]', themeObj.from);
    data.append('colorTheme[to]', themeObj.to);
    data.append('colorTheme[text]', themeObj.text);
    data.append('colorTheme[border]', themeObj.border);

    // 2. CRITICAL FIX: Ensure file is appended correctly
    if (imageFile) {
        data.append('image', imageFile);
    }

    try {
      // 3. THE MAGIC FIX: Override the headers
      // We set 'Content-Type' to undefined so the browser sets the "Boundary" automatically.
      const config = {
          headers: { 
              "Content-Type": "multipart/form-data" 
          }
      };

      if (editingId) {
        await api.put(`/courses/${editingId}`, data, config);
        alert('Course Updated Successfully!');
      } else {
        await api.post('/courses', data, config);
        alert('Course Created Successfully!');
      }
      
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert(`Failed: ${error.response?.data?.message || "Check console"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure?")) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter(c => c._id !== id));
        // If we deleted the course currently being edited, reset form
        if (editingId === id) resetForm();
      } catch {
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBook className="text-brand-red"/> Manage Courses
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: FORM (Create or Edit) --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-4">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                  {editingId ? 'Edit Course' : 'Add New Course'}
              </h3>
              {editingId && (
                  <button onClick={resetForm} className="text-xs text-red-500 flex items-center gap-1 hover:underline">
                      <FaTimes /> Cancel
                  </button>
              )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-red outline-none" />
            </div>
            
            {/* Slug */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full border p-2 rounded bg-gray-50 text-sm" />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                        <option value="SSC">SSC</option>
                        <option value="Banking">Banking</option>
                        <option value="State">State Exams</option>
                        <option value="Defence">Defence</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Badge</label>
                    <input name="badgeText" value={formData.badgeText} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" maxLength="500" required className="w-full border p-2 rounded" />
            </div>

            {/* Color Theme */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FaPalette/> Color Theme</label>
                <div className="flex gap-4 mt-1">
                    {['red', 'blue', 'green'].map(color => (
                        <label key={color} className="flex items-center gap-2 cursor-pointer capitalize">
                            <input type="radio" name="colorTheme" value={color} checked={formData.colorTheme === color} onChange={handleChange} />
                            <span className={`w-4 h-4 rounded-full bg-${color}-500`}></span> {color}
                        </label>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FaList/> Features</label>
                <div className="flex gap-2 mt-1">
                    <input 
                        value={currentFeature} 
                        onChange={(e) => setCurrentFeature(e.target.value)} 
                        placeholder="Add feature..." 
                        className="w-full border p-2 rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="bg-gray-800 text-white px-3 rounded hover:bg-black"><FaPlus/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feat, idx) => (
                        <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded-full flex items-center gap-1 border">
                            {feat} <FaTrash className="cursor-pointer text-red-400" onClick={() => removeFeature(idx)}/>
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Image Upload */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    {editingId ? 'Update Image (Optional)' : 'Course Image'}
                </label>
                <div className="border border-dashed p-3 rounded flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                   <FaUpload className="text-gray-400"/>
                   {/* Added ref to clear input after submit */}
                   <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="w-full text-sm" 
                   />
                </div>
            </div>

            <button disabled={isSubmitting} className={`w-full text-white py-3 rounded-lg font-bold shadow-md transition disabled:bg-gray-400 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brand-red hover:bg-red-700'}`}>
               {isSubmitting ? 'Processing...' : (editingId ? 'Update Course' : 'Create Course')}
            </button>
          </form>
        </div>

        {/* --- RIGHT: COURSE LIST --- */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
           {courses.map(course => (
             <div key={course._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all">
                {/* Image */}
                <div className="h-40 bg-gray-200 relative group">
                    {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
                    )}
                    
                    {/* NEW: Overlay Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(course)} className="bg-white text-blue-600 p-2 rounded-full hover:scale-110 transition shadow-lg">
                            <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(course._id)} className="bg-white text-red-500 p-2 rounded-full hover:scale-110 transition shadow-lg">
                            <FaTrash />
                        </button>
                    </div>

                    {course.badgeText && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow text-black uppercase">
                            {course.badgeText}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex-grow">
                   <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{course.category}</span>
                   </div>
                   
                   <h4 className={`text-xl font-bold mb-2 ${course.colorTheme?.text || 'text-gray-800'}`}>{course.title}</h4>
                   <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                   
                   <ul className="text-xs text-gray-500 space-y-1 mb-4">
                       {(course.features || []).slice(0, 3).map((feat, i) => (
                           <li key={i} className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {feat}</li>
                       ))}
                   </ul>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;