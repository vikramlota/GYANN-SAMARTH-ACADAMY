import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaPhone, FaWhatsapp, FaBookOpen } from 'react-icons/fa';

const BookDemo = () => {
  const [courses, setCourses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', whatsapp: '', courseInterested: ''
  });

  // Fetch courses for the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(Array.isArray(data) ? data : data.data || []);
      } catch (err) { console.error("Error fetching courses", err); }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Save to your database first (so you have a backup in Admin panel)
      await api.post('/demo-requests', formData);

      // 2. Format the message for WhatsApp
      // Replace with your actual Admin WhatsApp number (Include country code, no +)
      const adminWhatsAppNumber = "919041973105"; 
      
      const message = `*🔔 New Demo Class Request!*\n\n` +
                      `*Name:* ${formData.name}\n` +
                      `*Email:* ${formData.email}\n` +
                      `*Phone:* ${formData.phone}\n` +
                      `*WhatsApp:* ${formData.whatsapp}\n` +
                      `*Course Interested:* ${formData.courseInterested}`;

      // 3. Create the WhatsApp URL
      const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;

      // 4. Open WhatsApp in a new tab/app
      window.open(whatsappUrl, '_blank');

      // 5. Show success message on the website
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', whatsapp: '', courseInterested: '' });
      
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-red p-6 text-center">
            <h2 className="text-3xl font-black text-white">Book a Free Demo</h2>
            <p className="text-red-100 mt-2">Experience our teaching methodology before you join!</p>
        </div>
        
        <div className="p-8">
            {success ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h3 className="text-2xl font-bold text-gray-800">Request Sent!</h3>
                    <p className="text-gray-600 mt-2">Our team will contact you shortly to schedule your demo class.</p>
                    <button onClick={() => setSuccess(false)} className="mt-6 text-brand-red font-bold hover:underline">Book another demo</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><FaUser/> Full Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" placeholder="John Doe" />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><FaEnvelope/> Email Address</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" placeholder="john@example.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><FaPhone/> Phone Number</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" placeholder="10-digit number" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><FaWhatsapp className="text-green-500"/> WhatsApp</label>
                            <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-red outline-none" placeholder="WhatsApp number" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-1"><FaBookOpen/> Course Interested In</label>
                        <select required name="courseInterested" value={formData.courseInterested} onChange={handleChange} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-red outline-none bg-white">
                            <option value="" disabled>Select a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course.title}>{course.title}</option>
                            ))}
                            <option value="Other">Other / Not sure yet</option>
                        </select>
                    </div>

                    <button disabled={isSubmitting} className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 shadow-md transition disabled:bg-gray-400 mt-4">
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookDemo;