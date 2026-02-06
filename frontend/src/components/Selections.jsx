import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';
import api from '../utils/api'; // <--- Import your API utility

const Selections = () => {
  const [modalData, setModalData] = useState(null);
  const [students, setStudents] = useState([]); // <--- Dynamic State
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal();

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        // We use the '/results' endpoint because that's where we saved SuccessStories
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
    <section id="selections" className="py-16 md:py-24 bg-brand-bg relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-10 left-10 text-9xl text-brand-red/5 opacity-50 select-none pointer-events-none font-black rotate-12">SUCCESS</div>
      <div className="absolute bottom-10 right-10 text-9xl text-brand-orange/5 opacity-50 select-none pointer-events-none font-black -rotate-12">RESULTS</div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <span className="inline-block py-1 px-3 rounded-full bg-brand-red/10 text-brand-red font-semibold text-sm mb-2">Hall of Fame</span>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12">
           Our Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-orange">Selections</span>
        </h2>

        {/* Loading State */}
        {loading && <div className="text-gray-500 animate-pulse">Loading champions...</div>}

        {/* Dynamic Grid */}
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
           
           {!loading && students.length === 0 && (
               <div className="col-span-full text-gray-500 italic py-10">No selections uploaded yet. Check Admin Panel.</div>
           )}

           {students.map((student, idx) => (
             <div 
                key={student._id}
                onClick={() => setModalData(student)}
                className={`group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 flex flex-col items-center cursor-pointer transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
             >
                <div className="relative mb-3">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-red to-brand-orange rounded-full p-0.5"></div>
                    {/* Dynamic Image from Cloudinary */}
                    <img 
                        src={student.imageUrl || "https://placehold.co/150x150?text=Student"} 
                        alt={student.studentName} 
                        className="relative w-20 h-20 rounded-full border-4 border-white object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"><FaCheck /></div>
                </div>
                
                {/* Dynamic Name & Exam */}
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-brand-red transition-colors line-clamp-1">{student.studentName}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium border border-gray-200">{student.examName}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Modal - Now showing Dynamic Data */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/90 backdrop-blur-sm transition-opacity" onClick={() => setModalData(null)}>
            <div className="relative max-w-lg w-full bg-transparent flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={modalData.imageUrl || "https://placehold.co/400x400?text=Student"} 
                    alt={modalData.studentName} 
                    className="max-h-[70vh] w-auto rounded-xl shadow-2xl border-4 border-white" 
                />
                
                <div className="text-center mt-4">
                    <h3 className="text-white text-2xl font-bold">{modalData.studentName}</h3>
                    <p className="text-brand-orange font-bold text-lg">{modalData.examName} <span className="text-white/70 text-sm">| {modalData.rank}</span></p>
                    {modalData.testimonial && (
                        <p className="text-gray-300 italic mt-2 text-sm max-w-sm mx-auto">"{modalData.testimonial}"</p>
                    )}
                </div>

                <button className="absolute -top-10 right-0 text-white text-3xl hover:text-brand-orange" onClick={() => setModalData(null)}>
                    <FaTimes />
                </button>
            </div>
        </div>
      )}
    </section>
  );
};

export default Selections;