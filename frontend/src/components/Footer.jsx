import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaChevronRight, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';

const Footer = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <footer className="bg-brand-red text-white">
      <div ref={ref} className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Logo & Mission */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a href="#hero" className="text-3xl font-extrabold text-brand-orange flex items-center mb-4 bg-white/10 p-2 rounded-lg w-max">
                <span className="text-white">Samarth Academy</span>
            </a>
            <p className="text-sm mb-4 text-red-100 leading-relaxed">
                <b>Samarth Academy</b> has a strong and positive mission to provide best-in-class education for Banking, SSC, and other Competitive examination.
            </p>
            <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md"><FaFacebookF /></a>
                <a href="#" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md"><FaInstagram /></a>
                <a href="https://wa.me/919988949969" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md"><FaWhatsapp /></a>
            </div>
          </div>

          {/* Col 2: Courses */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">OUR COURSES</h4>
            <ul className="space-y-2 text-sm text-red-100">
                {['HP TET/TGT Exams', 'Bank Exams', 'HP State Exams', 'SSC Exams', 'Civil Services Exams', 'Sainik / Navodya School'].map((item, i) => (
                    <li key={i}>
                        <a href="#courses" className="hover:text-white hover:translate-x-1 transition flex items-center">
                            <FaChevronRight className="mr-2 text-brand-orange text-xs" /> {item}
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-red-100">
                {[
                    {name: 'About Us', link: '#about'},
                    {name: 'Selections', link: '#selections'},
                    {name: 'Schedule Demo', link: '#contact'},
                    {name: 'Exam Notification', link: '#updates'},
                    {name: 'Testimonials', link: '#hero'} // Assuming hero/testimonials section
                ].map((item, i) => (
                    <li key={i}>
                        <a href={item.link} className="hover:text-white hover:translate-x-1 transition flex items-center">
                            <FaChevronRight className="mr-2 text-brand-orange text-xs" /> {item.name}
                        </a>
                    </li>
                ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">CONTACT INFO</h4>
            <address className="space-y-3 text-sm not-italic text-red-100">
                <p className="flex items-center"><FaPhoneAlt className="mr-3 text-lg text-brand-orange" /> +91 99889 49969</p>
                <p className="flex items-center"><FaEnvelope className="mr-3 text-lg text-brand-orange" /> samarth.academy2006@gmail.com</p>
                <p className="flex items-start"><FaMapMarkerAlt className="mr-3 mt-1 text-lg text-brand-orange flex-shrink-0" /> SCF 68, UT MARKET, Opp. GNDU, AMRITSAR</p>
            </address>
          </div>

        </div>
      </div>

      <div className="bg-brand-orange py-4 text-center text-sm">
        <p>Copyright &copy; 2025 Samarth Academy</p>
      </div>
    </footer>
  );
};

export default Footer; 