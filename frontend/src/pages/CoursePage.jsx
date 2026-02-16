import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import CoursesPage from '../components/CoursePage';
import { FaArrowLeft, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';

const CoursePage = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If no slug, show the course list
  if (!slug) {
    return <CoursesPage />;
  }

  // Otherwise, show the course detail
  useEffect(() => {
    setLoading(true);
    api.get(`/courses/${slug}`)
       .then(res => {
         setCourse(res.data);
         setError('');
       })
       .catch(err => {
         console.error('Error fetching course:', err);
         setError('Course not found');
       })
       .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">{error || 'Course not found'}</h2>
        <Link to="/courses" className="text-brand-red hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <Link to="/courses" className="inline-flex items-center text-brand-red hover:underline mb-8 font-bold">
          <FaArrowLeft className="mr-2" /> Back to Courses
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section with Course Image */}
          <div className="relative h-96 bg-gradient-to-br from-brand-red to-orange-600 overflow-hidden">
            {course.image ? (
              <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-6xl font-bold">
                {course.category}
              </div>
            )}
            
            {/* Overlay with course title */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
              <div>
                <span className="bg-brand-orange text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
                  {course.category || 'General'}
                </span>
                <h1 className="text-5xl font-black text-white mb-2">{course.title}</h1>
                {course.badgeText && (
                  <p className="text-yellow-300 text-lg font-bold">{course.badgeText}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-brand-red">
                <p className="text-gray-600 text-sm font-bold uppercase mb-1">Exam Type</p>
                <p className="text-2xl font-bold text-gray-900">{course.category}</p>
              </div>
              
              {course.link && (
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-600 text-sm font-bold uppercase mb-3">Quick Access</p>
                  <a href={course.link} target="_blank" rel="noopener noreferrer" 
                     className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                    <FaExternalLinkAlt /> Visit Course
                  </a>
                </div>
              )}
              
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-bold uppercase mb-1">Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12 pb-12 border-b border-gray-200">
              <h2 className="text-3xl font-black text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-800 text-lg leading-relaxed">{course.description}</p>
            </div>

            {/* Features Section */}
            {course.features && course.features.length > 0 && (
              <div className="mb-12 pb-12 border-b border-gray-200">
                <h2 className="text-3xl font-black text-gray-900 mb-8">Course Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <FaCheck className="text-green-500 text-xl flex-shrink-0 mt-1" />
                      <p className="text-gray-800 font-medium">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-brand-red to-orange-600 rounded-xl p-8 text-white text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Enroll?</h3>
              <p className="text-white/90 mb-6 text-lg">Join thousands of students preparing for {course.category} exams</p>
              
              {course.link ? (
                <a href={course.link} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 bg-white text-brand-red font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition shadow-lg">
                  <FaExternalLinkAlt /> Enroll Now on Course Platform
                </a>
              ) : (
                <button className="bg-white text-brand-red font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition shadow-lg">
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;