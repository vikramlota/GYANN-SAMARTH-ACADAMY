import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaQuoteLeft, FaTrophy } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';
import api from '../utils/api'; 

const Selections = () => {
  const [students, setStudents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal();

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const response = await api.get('/results');
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching selections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelections();
  }, []);

  return (
    <section id="selections" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden min-h-screen">
      
      {/* Background Watermark Text */}
      <div className="absolute top-10 left-10 text-7xl md:text-9xl text-brand-red/5 opacity-50 select-none pointer-events-none font-black rotate-12">SUCCESS</div>
      <div className="absolute bottom-10 right-10 text-7xl md:text-9xl text-brand-orange/5 opacity-50 select-none pointer-events-none font-black -rotate-12">RESULTS</div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-brand-red/10 text-brand-red font-black text-xs tracking-widest uppercase mb-4 border border-brand-red/20 shadow-sm">
                Hall of Fame
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                Our Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Selections</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                Meet the brilliant minds who trusted Samarth Academy and turned their government job dreams into reality.
            </p>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        )}

        {/* Dynamic Detailed Grid (Changed to 3 columns for large cards) */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            
           {!loading && students.length === 0 && (
               <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                   <p className="text-gray-500 font-medium text-lg">No selections uploaded yet. Please add them from the Admin Panel.</p>
               </div>
           )}

           {students.map((student, idx) => (
             <div 
                key={student._id}
                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 flex flex-col transition-all duration-500 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
             >
                {/* Large Image Section */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-100">
                    <img 
                        src={student.imageUrl || "https://placehold.co/600x800/f3f4f6/a1a1aa?text=No+Photo"} 
                        alt={student.studentName} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                    />
                    
                    {/* Dark gradient overlay for text readability at the bottom of the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                    
                    {/* Floating Selection Badge */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg tracking-wide uppercase">
                        <FaCheckCircle /> Selected
                    </div>

                    {/* Name & Exam embedded in the image */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                        <h3 className="font-black text-3xl text-white mb-2 leading-tight drop-shadow-md">
                            {student.studentName}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-brand-red text-white font-bold text-xs px-3 py-1.5 rounded-md uppercase tracking-widest shadow-sm">
                                {student.examName}
                            </span>
                            {student.rank && (
                                <span className="bg-brand-orange text-white font-bold text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                                    <FaTrophy className="text-yellow-200"/> {student.rank}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Testimonial / Detail Section */}
                <div className="p-6 md:p-8 flex-grow flex flex-col bg-white">
                    {student.testimonial ? (
                        <div className="relative flex-grow">
                            <FaQuoteLeft className="absolute top-0 left-0 text-gray-100 text-4xl transform -translate-x-2 -translate-y-2" />