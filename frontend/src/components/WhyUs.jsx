import React from 'react';
import { FaTrophy, FaChalkboardTeacher, FaBookReader, FaUserFriends, FaDownload, FaArrowRight } from 'react-icons/fa';
import { useScrollReveal, useCounter } from '../hooks';

const WhyUs = () => {
  const [ref, isVisible] = useScrollReveal();
  // Using custom hook for the 96% counter
  const [countRef, count] = useCounter(96); 

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">The <span className="text-brand-red">Samarth</span> Edge</h2>
          <p className="text-gray-600 mt-4 text-lg">Why students trust us with their careers</p>
        </div>

        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:min-h-[500px] transition-all duration-700 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          
          {/* Block 1: Success Rate */}
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-brand-red to-red-900 rounded-3xl p-8 text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 opacity-10 bg-dot-pattern"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-sm font-medium mb-4 border border-white/10">
                <FaTrophy className="mr-2 text-yellow-300" /> Proven Track Record
              </div>
              <h3 className="text-3xl font-bold leading-tight max-w-sm">We turn aspirants into Officers.</h3>
            </div>
            
            <div className="mt-8 relative z-10">
              <div ref={countRef} className="flex items-baseline">
                <span className="text-7xl md:text-8xl font-black tracking-tighter">{count}%</span>
                <span className="text-xl md:text-2xl font-bold text-white ml-2">Success Rate</span>
              </div>
              <p className="text-white mt-4 max-w-md text-sm md:text-base border-l-4 border-brand-orange pl-4">Consistently delivering top rankers in State and Central government exams since inception.</p>
            </div>
          </div>

          {/* Block 2: Faculty */}
          <div className="md:col-span-1 md:row-span-2 bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-brand-orange text-2xl mb-6 group-hover:rotate-12 transition-transform duration-300">
              <FaChalkboardTeacher />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Faculty</h3>
            <p className="text-gray-600 text-sm flex-grow">Learn from the masters. Our teachers are subject matter experts with years of experience.</p>
            <div className="mt-6 flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
               <div className="flex -space-x-3">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://placehold.co/100x100/333/fff?text=T1" alt="T1" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://placehold.co/100x100/444/fff?text=T2" alt="T2" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-orange text-white text-xs flex items-center justify-center font-bold">+10</div>
               </div>
               <span className="text-xs font-bold text-gray-400">Top Mentors</span>
            </div>
          </div>

          {/* Block 3: Study Material */}
          <div className="md:col-span-1 md:row-span-1 bg-brand-orange rounded-3xl p-6 text-white relative overflow-hidden group hover:bg-orange-600 transition-colors shadow-lg flex flex-col justify-between">
              <FaBookReader className="absolute -right-6 -bottom-6 text-8xl text-white/10 group-hover:scale-110 transition-transform duration-500 rotate-12" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-1">Study Kit</h3>
                <p className="text-white/90 text-xs mb-3">Curated notes & books.</p>
                <a href="#contact" className="inline-flex items-center justify-center bg-white text-brand-orange px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-orange-50 transition">
                    Get Sample <FaDownload className="ml-2" />
                </a>
              </div>
          </div>

          {/* Block 4: Mentorship */}
          <div className="md:col-span-1 md:row-span-1 bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden group hover:bg-gray-800 transition-colors shadow-lg flex flex-col justify-between cursor-pointer">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red/20 rounded-full blur-xl -mr-5 -mt-5"></div>
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                      <div className="bg-gray-800 p-2 rounded-lg text-brand-red">
                          <FaUserFriends />
                      </div>
                      <FaArrowRight className="text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold">1-on-1 Focus</h3>
                  <p className="text-gray-400 text-xs">Personalized mentorship.</p>
              </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyUs;