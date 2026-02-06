import React, { useState } from 'react';
import { FaFilter, FaCamera } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';

const RESULTS_DATA = [
  { id: 1, name: 'Aditi Sharma', rank: 'AIR 1', exam: 'SBI PO', category: 'banking', img: '/images/results/1.jpg' },
  { id: 2, name: 'Rahul Singh', rank: 'Inspector', exam: 'SSC CGL', category: 'ssc', img: '/images/results/2.jpg' },
  { id: 3, name: 'Vikram Jeet', rank: 'Selected', exam: 'HP Police', category: 'state', img: '/images/results/3.jpg' },
  { id: 4, name: 'Priya', rank: 'Selected', exam: 'IBPS Clerk', category: 'banking', img: '/images/results/4.jpg' },
  { id: 5, name: 'Amit Kumar', rank: 'Qualified', exam: 'HP TET', category: 'state', img: '/images/results/5.jpg' },
  { id: 6, name: 'Neha', rank: 'Selected', exam: 'SSC CHSL', category: 'ssc', img: '/images/results/6.jpg' },
];

const Results = () => {
  const [filter, setFilter] = useState('all');
  const [ref, isVisible] = useScrollReveal();

  const filteredResults = filter === 'all' ? RESULTS_DATA : RESULTS_DATA.filter(r => r.category === filter);

  return (
    <div className="bg-gray-50 min-h-screen">
       <header className="relative bg-brand-red pt-16 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs mb-4 tracking-wider uppercase">Hall of Fame</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Exam Results</h1>
            <p className="text-red-100 text-lg max-w-2xl mx-auto">Celebrating the success of our bright stars.</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
         {/* Sidebar Filter */}
         <aside className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center"><FaFilter className="text-brand-red mr-2"/> Gallery Filter</h3>
               </div>
               <nav className="space-y-2">
                  {[
                      { key: 'all', label: 'All Photos', count: RESULTS_DATA.length },
                      { key: 'banking', label: 'Banking', count: RESULTS_DATA.filter(r=>r.category==='banking').length },
                      { key: 'ssc', label: 'SSC', count: RESULTS_DATA.filter(r=>r.category==='ssc').length },
                      { key: 'state', label: 'State Exams', count: RESULTS_DATA.filter(r=>r.category==='state').length }
                  ].map(btn => (
                      <button 
                        key={btn.key}
                        onClick={() => setFilter(btn.key)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium text-sm transition-all flex justify-between items-center group ${filter === btn.key ? 'bg-brand-red/10 text-brand-red font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <span className="flex items-center">{btn.label} {filter === btn.key && <FaCamera className="ml-2 text-xs"/>}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${filter === btn.key ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white'}`}>{btn.count}</span>
                      </button>
                  ))}
               </nav>
               {/* Sidebar CTA */}
               <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="bg-gray-900 rounded-xl p-5 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-red rounded-full filter blur-xl opacity-20 group-hover:opacity-40 transition"></div>
                        <h4 className="font-bold mb-2 relative z-10">Be The Next Topper!</h4>
                        <p className="text-xs text-gray-400 mb-4 relative z-10">Join our upcoming batch.</p>
                        <a href="#contact" className="block w-full bg-white text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-gray-100 transition text-center relative z-10">Enquire Now</a>
                    </div>
                </div>
            </div>
         </aside>

         {/* Grid */}
         <div ref={ref} className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredResults.map((student) => (
                <div key={student.id} className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <img src={student.img} alt={student.name} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" onError={(e)=>e.target.src='https://placehold.co/400x500/333/FFF'} />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                        <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1 inline-block">{student.exam}</span>
                        <h3 className="text-white font-bold text-lg">{student.name}</h3>
                        <p className="text-gray-300 text-xs">{student.rank}</p>
                    </div>
                </div>
            ))}
         </div>
      </main>
    </div>
  );
};

export default Results;