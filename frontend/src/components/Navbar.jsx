import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. Import Link
import { FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaInstagram, FaYoutube, FaBars, FaTimes, FaGooglePlay, FaAppStoreIos } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Optional: used if you want to highlight the active link

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // 2. Updated Paths to match App.js routes (start with /)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Results', path: '/selections' },
    { name: 'Notifications', path: '/notifications' },
    { name: 'Current Affairs', path: '/current-affairs' }
  ];

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-red text-white py-2 text-sm hidden md:block border-b border-white/10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="flex items-center"><FaPhoneAlt className="mr-2 text-brand-orange" /> +91 99889 49969</span>
            <span className="flex items-center"><FaEnvelope className="mr-2 text-brand-orange" /> samarth.academy2006@gmail.com</span>
            <span className="flex items-center"><FaClock className="mr-2 text-brand-orange" /> 9:00 to 6:00 (Mon-Sat)</span>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/samarthacademy2006" className="hover:text-brand-orange transition"><FaFacebookF /></a>
            <a href="https://www.instagram.com/gyanm.samarth.academy?igsh=MTB0NnI5dTliNDlicA%3D%3D" className="hover:text-brand-orange transition"><FaInstagram /></a>
            <a href="https://youtube.com/@samarth.academyy?si=N6X6HSt5YGEi8goV" className="hover:text-brand-orange transition"><FaYoutube /></a>
            <a href="https://play.google.com/store/apps/details?id=co.diy4.ptqkn&pcampaignid=web_share" className="hover:text-brand-orange transition"><FaGooglePlay /></a>
            <a href="https://apps.apple.com/in/app/classplus/id1324522260" className="hover:text-brand-orange transition"><FaAppStoreIos /></a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo - Use Link for Home */}
          <Link to="/" className="flex items-center group">
            {/* Replace src with your actual image path in public folder */}
            <img src="/images/purelogo.png" alt="Samarth Academy" className="w-14 h-14 object-contain group-hover:scale-105 transition-transform rounded-md" />
            <div className="ml-2 flex flex-col">
              <span className="text-2xl font-black text-gray-900 leading-none">SAMARTH</span>
              <span className="text-xs font-bold text-brand-red tracking-widest">ACADEMY</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center text-gray-700 font-semibold text-sm uppercase tracking-wide">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`transition relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-brand-red after:transition-all hover:after:w-full hover:text-brand-red
                ${isActive(link.path) ? 'text-brand-red after:w-full' : 'after:w-0'}`}
              >
                {link.name}
              </Link>
            ))}
            {/* External/Anchor links usually stay as <a> tags */}
            <a href="/book-demo" className="bg-brand-red text-white py-2.5 px-6 rounded-full shadow-lg hover:bg-red-800 hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              BOOK DEMO CLASS
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-gray-800" onClick={toggleMenu}>
            <FaBars className="text-2xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu}>
        <div className={`absolute top-0 right-0 w-72 h-full bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-black text-brand-red">MENU</span>
              <button onClick={toggleMenu}><FaTimes className="text-gray-500 hover:text-brand-red text-3xl" /></button>
            </div>
            <ul className="space-y-4 text-gray-800 font-bold text-lg">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    onClick={toggleMenu} 
                    className={`block py-2 border-b border-gray-100 hover:text-brand-red ${isActive(link.path) ? 'text-brand-red pl-2 border-l-4 border-brand-red' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link to="/book-demo" className="...">BOOK DEMO CLASS</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;