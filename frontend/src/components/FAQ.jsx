import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className={`group bg-white ${isOpen ? 'active' : ''}`}>
      <button 
        className={`flex justify-between items-center w-full p-6 text-left font-bold text-gray-900 focus:outline-none hover:text-brand-red transition-colors ${isOpen ? 'text-brand-red' : ''}`} 
        onClick={toggle}
      >
        <span>{question}</span>
        <FaPlus className={`text-brand-orange transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="p-6 pt-0 text-gray-600 bg-brand-bg/30">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, isVisible] = useScrollReveal();

  const faqs = [
    { q: "When is the new batch starting?", a: "We offer for more than 30 courses at our Samarth Academy Institute. For every course there is different batch schedule. To inquire about your preferred course, just give us a call." },
    { q: "How many seats do you preserve for each class?", a: "To ensure personalized attention, we keep limited seats (typically 25-30 students) per batch. This helps our faculty maintain focus and deliver the best possible educational experience for every student." },
    { q: "Do you offer a demo class?", a: "Yes, absolutely! We encourage prospective students to attend a free demo class to experience our teaching methodology and infrastructure firsthand before committing to a full course." },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        {/* Image */}
        <div className={`md:w-1/3 flex justify-center transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
           <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800" alt="Student" className="rounded-xl shadow-2xl h-full w-auto max-h-[450px] object-cover transform rotate-2 hover:rotate-0 transition-transform duration-500" />
        </div>

        {/* Accordion */}
        <div ref={ref} className={`md:w-2/3 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 mb-10">
                Frequently Asked <span className="text-brand-red">Questions</span>
            </h2>
            <div className="border border-gray-100 rounded-2xl shadow-lg divide-y divide-gray-100 overflow-hidden">
                {faqs.map((faq, index) => (
                    <FAQItem 
                        key={index} 
                        question={faq.q} 
                        answer={faq.a} 
                        isOpen={openIndex === index} 
                        toggle={() => setOpenIndex(openIndex === index ? -1 : index)} 
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;