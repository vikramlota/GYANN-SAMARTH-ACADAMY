import React from 'react';
import { FaPhoneAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';

const Contact = () => {
  const [ref, isVisible] = useScrollReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! This is a static demo. Your message has been 'sent'.");
    e.target.reset();
  };

  return (
    <section id="contact" className="bg-brand-red py-16 md:py-24">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Info */}
        <div className={`lg:w-1/2 text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-2xl font-semibold mb-2">Admissions Open</p>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6">Enroll Now</h2>
            <p className="mb-8 max-w-lg text-lg">
                We offer limited seats for every batch to give proper attention to each student. Admissions are on the basis of first come first preference.
            </p>
            <div className="space-y-4">
                <div className="flex items-center text-xl font-bold">
                    <FaPhoneAlt className="mr-3 text-2xl" /> +91 99889 49969
                </div>
                <div className="flex items-center text-lg">
                    <FaClock className="mr-3 text-2xl" /> 9:00 to 6:00 (Mon - Sat)
                </div>
                <div className="flex items-start text-lg pt-4">
                    <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-2xl" /> 
                    <span className="font-medium">
                        <b>Samarth Academy</b>, <br />
                        SCF 68, UT MARKET, Opp. GNDU, AMRITSAR
                    </span>
                </div>
            </div>
        </div>

        {/* Right Side: Form */}
        <div ref={ref} className={`lg:w-1/2 w-full transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1 text-center">Get In Touch</h3>
                <p className="text-center text-gray-500 mb-8">For enquiry about course</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input type="text" placeholder="Full Name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none transition" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input type="email" placeholder="Email" required className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none transition" />
                        <input type="tel" placeholder="Phone Number" required className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red outline-none transition" />
                    </div>
                    <div>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red text-gray-500 outline-none transition">
                            <option>------ Select Course ------</option>
                            <option>HP TET / TGT / C-TET</option>
                            <option>Bank Exams</option>
                            <option>HP State Exams</option>
                            <option>SSC Exams</option>
                            <option>Civil Services Exams</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 transform hover:scale-[1.01]">
                        SEND
                    </button>
                </form>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;