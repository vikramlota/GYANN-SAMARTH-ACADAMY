import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaTrash, FaPlus, FaBook, FaUpload, FaPalette, FaList } from 'react-icons/fa';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  // Feature input state
  const [currentFeature, setCurrentFeature] = useState('');

  // Form State matches your Schema
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'SSC',
    badgeText: '', // e.g. "Bestseller"
    colorTheme: 'red', // Simplified selector for UI
    features: [] // Array of strings
  });

  // 1. Fetch Courses
  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) { console.error("Error loading courses", err); }
  };

  useEffect(() => { fetchCourses(); }, []);

  // 2. Handle Text Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title
    if (name === 'title') {
      const generatedSlug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setFormData({ ...formData, title: value, slug: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 3. Feature List Logic
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

  // 4. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('slug', formData.slug);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('badgeText', formData.badgeText);
    
    // Send features as JSON string or individual items depending on backend
    // Usually FormData sends arrays as 'features[0]', 'features[1]'
    formData.features.forEach((feat, index) => {
        data.append(`features[${index}]`, feat);
    });

    // Handle Color Theme Logic (Mapping simple selection to complex object)
    let themeObj = { from: 'from-brand-red', to: 'to-orange-600', text: 'text-brand-red', border: 'border-brand-red' };
    
    if (formData.colorTheme === 'blue') {
        themeObj = { from: 'from-blue-600', to: 'to-cyan-500', text: 'text-blue-600', border: 'border-blue-600' };
    } else if (formData.colorTheme === 'green') {
        themeObj = { from: 'from-green-600', to: 'to-emerald-500', text: 'text-green-600', border: 'border-green-600' };
    }
    
    // Stringify nested objects for FormData
    data.append('colorTheme[from]', themeObj.from);
    data.append('colorTheme[to]', themeObj.to);
    data.append('colorTheme[text]', themeObj.text);
    data.append('colorTheme[border]', themeObj.border);

    if (imageFile) data.append('image', imageFile);

    try {
      await api.post('/courses', data);
      alert('Course Created Successfully!');
      setFormData({ title: '', slug: '', description: '', category: 'SSC', badgeText: '', colorTheme: 'red', features: [] });
      setImageFile(null);
      fetchCourses();
    } catch (error) {
      console.error(error.response?.data || error.message || error);
      alert('Failed to create course. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${id}`);
        setCourses(courses.filter(c => c._id !== id));
      } catch {
        alert('Failed to delete course');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaBook className="text-brand-red"/> Manage Courses</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: CREATE FORM --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-4">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Add New Course</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title & Slug */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. SSC CGL Mastery" required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-red outline-none" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Slug (Auto-generated)</label>
                <input name="slug" value={formData.slug} onChange={handleChange} placeholder="ssc-cgl-mastery" required className="w-full border p-2 rounded bg-gray-50 text-sm" />
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
                    <label className="text-xs font-bold text-gray-500 uppercase">Badge (Optional)</label>
                    <input name="badgeText" value={formData.badgeText} onChange={handleChange} placeholder="e.g. Bestseller" className="w-full border p-2 rounded" />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Description (Max 500)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief details..." rows="3" maxLength="500" required className="w-full border p-2 rounded" />
            </div>

            {/* Color Theme */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FaPalette/> Color Theme</label>
                <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="colorTheme" value="red" checked={formData.colorTheme === 'red'} onChange={handleChange} />
                        <span className="w-4 h-4 rounded-full bg-red-500"></span> Red
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="colorTheme" value="blue" checked={formData.colorTheme === 'blue'} onChange={handleChange} />
                        <span className="w-4 h-4 rounded-full bg-blue-500"></span> Blue
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="colorTheme" value="green" checked={formData.colorTheme === 'green'} onChange={handleChange} />
                        <span className="w-4 h-4 rounded-full bg-green-500"></span> Green
                    </label>
                </div>
            </div>

            {/* Features List */}
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><FaList/> Key Features</label>
                <div className="flex gap-2 mt-1">
                    <input 
                        value={currentFeature} 
                        onChange={(e) => setCurrentFeature(e.target.value)} 
                        placeholder="e.g. 100+ Live Classes" 
                        className="w-full border p-2 rounded text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" onClick={addFeature} className="bg-gray-800 text-white px-3 rounded hover:bg-black"><FaPlus/></button>
                </div>
                {/* Feature Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feat, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 border">
                            {feat} <FaTrash className="cursor-pointer text-red-400 hover:text-red-600" onClick={() => removeFeature(idx)}/>
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Image Upload */}
            <div className="border border-dashed p-3 rounded flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
               <FaUpload className="text-gray-400"/>
               <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm" />
            </div>

            <button disabled={isSubmitting} className="w-full bg-brand-red text-white py-3 rounded-lg font-bold hover:bg-red-700 shadow-md transition disabled:bg-gray-400">
               {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>

        {/* --- RIGHT: COURSE LIST --- */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
           {courses.map(course => (
             <div key={course._id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all">
                {/* Image Area */}
                <div className="h-40 bg-gray-200 relative">
                    {course.image ? (
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
                    )}
                    {course.badgeText && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded shadow text-black uppercase">
                            {course.badgeText}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-grow">
                   <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{course.category}</span>
                       <button onClick={() => handleDelete(course._id)} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition">
                           <FaTrash/>
                       </button>
                   </div>
                   
                   <h4 className={`text-xl font-bold mb-2 ${course.colorTheme?.text || 'text-gray-800'}`}>{course.title}</h4>
                   <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                   
                   {/* Features Preview */}
                   <ul className="text-xs text-gray-500 space-y-1 mb-4">
                       {(course.features || []).slice(0, 3).map((feat, i) => (
                           <li key={i} className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {feat}</li>
                       ))}
                       {(course.features || []).length > 3 && <li>+ {(course.features.length - 3)} more...</li>}
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