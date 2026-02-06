import React from 'react';
import { FaBullhorn, FaChevronRight, FaTelegramPlane } from 'react-icons/fa';
import { useScrollReveal, useCounter } from '../hooks';

const StatBox = ({ target, suffix, title, colorClass, borderColor }) => {
  const [ref, count] = useCounter(target);
  
  return (
    <div ref={ref} className={`bg-white p-6 rounded-2xl shadow-lg border-b-4 ${borderColor} text-center hover:-translate-y-1 transition-transform`}>
      <div className={`text-4xl font-black ${colorClass} mb-1`}>{count}{suffix}</div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</div>
    </div>
  );
};

const About = () => {
  const [revealRef, isRevealed] = useScrollReveal();

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">
        
        {/* Left: Notice Board */}
        <div className={`md:w-1/3 transition-all duration-700 transform ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-brand-orange to-orange-600 p-5 flex justify-between items-center">
              <h3 className="text-white font-black text-lg tracking-wide flex items-center">
                 <FaBullhorn className="mr-2" /> LATEST NOTICES
              </h3>
              <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
            </div>
            
            <div className="p-0 divide-y divide-gray-100 max-h-[400px] overflow-y-auto scrollbar-hide">
               {/* Notice Item */}
               <div className="p-5 hover:bg-orange-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-800 text-sm group-hover:text-brand-orange transition-colors">Check Latest Notification</h4>
                      <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Updates Daily</p>
                  <a href="#" className="text-xs font-semibold text-brand-orange flex items-center">Read Details <FaChevronRight className="ml-1 text-[10px]" /></a>
               </div>
               
               {/* Telegram Promo */}
               <div className="p-5 bg-blue-50/50">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-2">
                        <FaTelegramPlane className="text-2xl" />
                        <h4 className="font-bold text-sm">Join Telegram Channel</h4>
                     </div>
                     <p className="text-xs text-blue-100 mb-3">Get free PDFs, Notes & Daily Quizzes instantly.</p>
                     <a href="#" className="inline-block bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">Join Now</a>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div ref={revealRef} className={`md:w-2/3 transition-all duration-700 delay-200 transform ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <span className="text-brand-red font-bold tracking-widest text-sm uppercase mb-2 block">Who We Are</span>
            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Shaping Careers Since 2006. <br />
                <span className="text-gray-400">Your Success is Our Tradition.</span>
            </h2>
            <div className="prose text-gray-600 mb-10 leading-relaxed">
                <p className="mb-4">
                    <b>Samarth Academy</b> stands as a beacon of excellence in Amritsar, dedicated to empowering students for Civil Services, Banking, SSC, and State Exams.
                </p>
                <p>
                    With a curriculum designed by industry veterans and a focus on <span className="text-brand-red font-semibold">speed, accuracy, and conceptual clarity</span>, we ensure every aspirant is exam-ready.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <StatBox target={96} suffix="%" title="Success Rate" colorClass="text-brand-red" borderColor="border-brand-red" />
                <StatBox target={15} suffix="+" title="Specialized Courses" colorClass="text-brand-orange" borderColor="border-brand-orange" />
                <StatBox target={100} suffix="%" title="Expert Faculty" colorClass="text-gray-800" borderColor="border-gray-800" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;