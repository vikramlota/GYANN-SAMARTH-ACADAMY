import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  FaArrowLeft, FaCheckCircle, FaWhatsapp, FaShare, 
  FaTag, FaGraduationCap, FaChalkboardTeacher, FaClock
} from 'react-icons/fa';

const CourseDetail = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course by slug. 
        // Note: Ensure your backend has a GET /api/courses/:slug or /api/courses/:id route!
        const response = await api.get(`/courses/${slug}`);
        
        // Handle nested data structures gracefully
        const data = response.data.data || response.data;
        
        // If your API returns an array (e.g., filtering by slug), grab the first item
        const courseData = Array.isArray(data) ? data[0] : data;

        if (courseData) {
            setCourse(courseData);
        } else {
            setError("Course not found.");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Could not load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCourse();
  }, [slug]);

  const shareCourse = () => {
    if (navigator.share) {
      navigator.share({
        title: course?.title,
        text: `Check out this course: ${course?.title} at Samarth Academy!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Course link copied to clipboard!');
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">{error || "Course not found"}</h2>
        <Link to="/courses" className="text-brand-red hover:underline flex items-center">
            <FaArrowLeft className="mr-2"/> Browse All Courses
        </Link>
      </div>
    );
  }

  // Fallback theme colors if not provided
  const themeText = course.colorTheme?.text || 'text-brand-red';
  const themeBg = course.colorTheme?.from || 'from-brand-red';

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      
      {/* --- HERO SECTION --- */}
      <header className={`relative bg-gradient-to-r ${themeBg} ${course.colorTheme?.to || 'to-red-900'} pt-24 pb-32 overflow-hidden`}>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <Link to="/courses" className="inline-flex items-center py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs mb-6 tracking-wider uppercase hover:bg-white/20 transition-colors">
            <FaArrowLeft className="mr-2" /> All Courses
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
             {/* Title & Info */}
             <div className="flex-1 text-center md:text-left">
                {course.badgeText && (
                    <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 shadow-sm">
                        {course.badgeText}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                    {course.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90 font-medium mt-4">
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                        <FaTag /> {course.category}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                        <FaChalkboardTeacher /> Expert Faculty
                    </span>
                </div>
             </div>

             {/* Hero Image */}
             {course.image && (
                 <div className="w-full md:w-1/3 lg:w-2/5 relative">
                     <div className="absolute inset-0 bg-white rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
                     <img 
                        src={course.image} 
                        alt={course.title} 
                        className="relative z-10 w-full h-auto rounded-2xl shadow-2xl object-cover border-4 border-white/10"
                     />
                 </div>
             )}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="container mx-auto px-4 max-w-6xl -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Description & Features (Takes up 2/3) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* About Box */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${themeText}`}>
                        <FaGraduationCap /> About This Course
                    </h2>
                    <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                        {course.description}
                    </div>
                </div>

                {/* Features Box */}
                {course.features && course.features.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        <h2 className={`text-2xl font-bold mb-6 ${themeText}`}>Course Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                                    <FaCheckCircle className={`mt-1 text-xl ${themeText}`} />
                                    <span className="text-gray-800 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Floating Action Card (Takes up 1/3) */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to start?</h3>
                    <p className="text-gray-500 text-sm mb-6">Join hundreds of successful students who have accelerated their careers with Samarth Academy.</p>
                    
                    <div className="space-y-4">
                        {/* Primary CTA - WhatsApp Inquiry */}
                        <a 
                            href={`https://wa.me/919988949969?text=Hello! I am interested in joining the ${encodeURIComponent(course.title)} course.`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            <FaWhatsapp className="text-2xl" /> Inquire on WhatsApp
                        </a>

                        {/* Secondary CTA - Share */}
                        <button 
                            onClick={shareCourse}
                            className="w-full bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                        >
                            <FaShare /> Share Course
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <FaClock className="text-brand-orange" /> Flexible Batch Timings
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <FaCheckCircle className="text-brand-orange" /> 100% Syllabus Coverage
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default CourseDetail;