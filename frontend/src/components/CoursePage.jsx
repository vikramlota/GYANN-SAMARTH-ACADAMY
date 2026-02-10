import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaClock, FaTag, FaBookOpen } from 'react-icons/fa';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
       .then(res => setCourses(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, []);

  // Get image URL - all images are from Cloudinary
  const getImageUrl = (course) => {
    return course.image || "https://placehold.co/400x250";
  };

  if (loading) return <div className="text-center py-20">Loading Courses...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-black text-center text-gray-900 mb-12">Our <span className="text-brand-red">Courses</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {courses.map(course => (
             <div key={course._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                <img src={getImageUrl(course)} alt={course.title} className="w-full h-48 object-cover"/>
                <div className="p-6">
                   <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                   <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><FaClock className="text-brand-red"/> {course.duration}</span>
                      <span className="flex items-center gap-1"><FaTag className="text-green-600"/> {course.price}</span>
                   </div>
                   <p className="text-gray-600 text-sm mb-6 line-clamp-2">{course.description}</p>
                   <button className="w-full bg-brand-red text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">
                      Enroll Now
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;