import React from 'react';
import { FaQuoteRight } from 'react-icons/fa';

const TestimonialCard = ({ name, text, color, borderColor }) => (
  <div className={`bg-brand-bg rounded-3xl p-8 shadow-lg border-t-4 ${borderColor} relative overflow-hidden w-[350px] h-[400px] flex flex-col justify-center shrink-0 hover:scale-105 transition-transform duration-300`}>
     <FaQuoteRight className={`absolute top-6 right-6 text-6xl ${color} opacity-10`} />
     <div className="relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
           <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mb-3 border-4 border-white shadow-md">
              <img src={`https://placehold.co/150x150/${borderColor.replace('border-', '').replace('#', '')}/ffffff?text=${name.charAt(0)}`} alt={name} className="w-full h-full object-cover" />
           </div>
           <div>
              <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-1 inline-block ${color.replace('text-', 'bg-').replace('/10', '')}/10 ${color} border-current opacity-80`}>Verified Alumni</span>
           </div>
        </div>
        <p className="text-gray-600 italic leading-relaxed text-center text-sm">"{text}"</p>
     </div>
  </div>
);

const Testimonials = () => {
  // Data duplicated for seamless loop effect
  const reviews = [
    { name: 'Nittu Chauhan', text: 'Samarth Academy is one of the best academies for State level Exams. The faculty helped us clear all our hurdles.', color: 'text-brand-red', border: 'border-brand-red' },
    { name: 'Shalini Sharma', text: 'Teachers are very cooperative and the environment is friendly for SSC Students. The academic staff is supportive.', color: 'text-brand-orange', border: 'border-brand-orange' },
    { name: 'Pankaj Sandhu', text: 'The institute is well equipped with state-of-the-art technology which will prove beneficial for online exams.', color: 'text-brand-red', border: 'border-brand-red' },
    // Duplicates
    { name: 'Nittu Chauhan', text: 'Samarth Academy is one of the best academies for State level Exams. The faculty helped us clear all our hurdles.', color: 'text-brand-red', border: 'border-brand-red' },
    { name: 'Shalini Sharma', text: 'Teachers are very cooperative and the environment is friendly for SSC Students. The academic staff is supportive.', color: 'text-brand-orange', border: 'border-brand-orange' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange font-semibold text-sm mb-2">Alumni Reviews</span>
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Voices of <span className="text-brand-red">Victory</span></h2>
        </div>

        <div className="relative overflow-hidden group">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex space-x-8 animate-marquee">
               {reviews.map((rev, index) => (
                  <TestimonialCard key={index} name={rev.name} text={rev.text} color={rev.color} borderColor={rev.border} />
               ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;