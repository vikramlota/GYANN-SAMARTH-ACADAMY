import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import CoursesPage from '../components/CoursePage';
import { FaArrowLeft } from 'react-icons/fa';

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
      <div className="container mx-auto max-w-4xl px-4">
        <Link to="/courses" className="inline-flex items-center text-brand-red hover:underline mb-6">
          <FaArrowLeft className="mr-2" /> Back to Courses
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <img src={course.image || "https://placehold.co/600x400"} alt={course.title} className="w-full h-96 object-cover" />
          
          <div className="p-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{course.title}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm">Category</p>
                <p className="text-xl font-bold text-gray-900">{course.category || 'General'}</p>
              </div>
              {course.badgeText && (
                <div>
                  <p className="text-gray-600 text-sm">Badge</p>
                  <p className="text-xl font-bold text-brand-red">{course.badgeText}</p>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Course</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">{course.description}</p>

            {course.features && course.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Features</h3>
                <ul className="space-y-2">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="text-brand-red font-bold mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-red-700 transition text-lg">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;