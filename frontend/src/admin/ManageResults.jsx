import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // Use your configured API
import { FaTrash, FaPlus, FaTrophy, FaUpload } from 'react-icons/fa';

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State matches your SuccessStory Schema
  const [formData, setFormData] = useState({
    studentName: '',
    examName: '',
    rank: '',
    category: 'Banking', // Default dropdown value
    year: new Date().getFullYear(),
    testimonial: ''
  });
  const [imageFile, setImageFile] = useState(null);

  // 1. Fetch Existing Results
  const fetchResults = async () => {
    try {
      const { data } = await api.get('/results');
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // 2. Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle File Input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 4. Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create FormData object to send text + image
    const data = new FormData();
    data.append('studentName', formData.studentName);
    data.append('examName', formData.examName);
    data.append('rank', formData.rank);
    data.append('category', formData.category);
    data.append('year', formData.year);
    data.append('testimonial', formData.testimonial);
    
    if (imageFile) {
      data.append('image', imageFile); // Must match backend upload.single('image')
    }

    try {
      await api.post('/results', data);
      alert('Student added to Hall of Fame!');
      
      // Reset Form
      setFormData({
        studentName: '',
        examName: '',
        rank: '',
        category: 'Banking',
        year: new Date().getFullYear(),
        testimonial: ''
      });
      setImageFile(null);
      
      // Refresh List
      fetchResults();
    } catch (error) {
      console.error('Error adding result:', error.response?.data || error.message || error);
      alert('Failed to add result. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Delete Result
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await api.delete(`/results/${id}`);
        setResults(results.filter((res) => res._id !== id));
      } catch {
        alert('Error deleting result');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaTrophy className="text-yellow-500"/> Manage Hall of Fame
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            Total Achievers: {results.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: ADD NEW FORM --- */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FaPlus className="text-brand-red"/> Add New Achiever
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Student Name</label>
                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-red outline-none" placeholder="e.g. Rahul Sharma" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Exam</label>
                            <input type="text" name="examName" value={formData.examName} onChange={handleChange} required 
                                className="w-full border p-2 rounded" placeholder="e.g. SBI PO" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Rank/Status</label>
                            <input type="text" name="rank" value={formData.rank} onChange={handleChange} required 
                                className="w-full border p-2 rounded" placeholder="e.g. Selected" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded bg-white">
                                <option value="Banking">Banking</option>
                                <option value="SSC">SSC</option>
                                <option value="State">State Exams</option>
                                <option value="Defence">Defence</option>
                                <option value="Teaching">Teaching</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} required 
                                className="w-full border p-2 rounded" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Photo</label>
                        <div className="border border-dashed border-gray-300 p-2 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                            <FaUpload className="text-gray-400"/>
                            <input type="file" onChange={handleFileChange} required className="text-sm w-full" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Testimonial (Optional)</label>
                        <textarea name="testimonial" value={formData.testimonial} onChange={handleChange} 
                            className="w-full border p-2 rounded" rows="3" placeholder="What did they say?"></textarea>
                    </div>

                    <button type="submit" disabled={isSubmitting} 
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-brand-red hover:bg-red-700 shadow-md hover:shadow-lg'}`}>
                        {isSubmitting ? 'Uploading...' : 'Add to Hall of Fame'}
                    </button>
                </form>
            </div>
        </div>

        {/* --- RIGHT: LIST OF RESULTS --- */}
        <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-6">Current Achievers</h3>
                
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading list...</div>
                ) : results.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                        No students added yet. Use the form to add one!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((item) => (
                            <div key={item._id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gray-50">
                                <img 
                                    src={item.imageUrl || "https://placehold.co/100"} 
                                    alt={item.studentName} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="ml-4 flex-grow">
                                    <h4 className="font-bold text-gray-900">{item.studentName}</h4>
                                    <p className="text-xs text-brand-red font-semibold">{item.examName} • {item.rank}</p>
                                    <p className="text-xs text-gray-500">{item.year} • {item.category}</p>
                                </div>
                                <button 
                                    onClick={() => handleDelete(item._id)} 
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Result"
                                >
                                    <FaTrash />
                                </button>
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

export default ManageResults;