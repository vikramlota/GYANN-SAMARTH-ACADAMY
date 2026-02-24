import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal routing
import { FaFacebookF, FaInstagram, FaWhatsapp, FaChevronRight, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGooglePlay, FaAppStoreIos } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';
import api from '../utils/api'; // Make sure this path is correct for your project

const Footer = () => {
  const [ref, isVisible] = useScrollReveal();
  const [footerCourses, setFooterCourses] = useState([]);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        const data = response.data.data || response.data;
        // Slice the array to show only the latest/top 6 courses so the footer doesn't get too long
        if (Array.isArray(data)) {
          setFooterCourses(data.slice(0, 6)); 
        }
      } catch (error) {
        console.error("Error fetching courses for footer:", error);
      }
    };
    fetchCourses();
  }, []);

  const copyText = () => {
  navigator.clipboard.writeText("Kaylhy");
  
};
  return (
    <footer className="bg-brand-red text-white">
      <div ref={ref} className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Logo & Mission */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="/" className="text-3xl font-extrabold text-brand-orange flex items-center mb-4 bg-white/10 p-2 rounded-lg w-max">
                <span className="text-white">Samarth Academy</span>
            </Link>
            <p className="text-sm mb-4 text-red-100 leading-relaxed">
                <b>Samarth Academy</b> has a strong and positive mission to provide best-in-class education for Banking, SSC, and other Competitive examination.
            </p>
            <div className="flex space-x-3">
                <a href="" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md"><FaFacebookF /></a>
                <a href="https://www.instagram.com/gyanm.samarth.academy?igsh=MTB0NnI5dTliNDlicA%3D%3D" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md"><FaInstagram /></a>
                <a href="https://wa.me/919041973105" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                <a href="https://play.google.com/store/apps/details?id=co.diy4.ptqkn&pcampaignid=web_share" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md" target="_blank" rel="noreferrer"><FaGooglePlay /></a>
                <a href="https://apps.apple.com/in/app/classplus/id1324522260" className="w-8 h-8 flex items-center justify-center bg-white text-brand-red rounded-full hover:bg-brand-orange hover:text-white transition transform hover:scale-110 shadow-md" target="_blank" rel="noreferrer"><FaAppStoreIos /></a>
              
                
                
            </div>
            <p className="  text-white mt-4 font-bold">
              ClassPlus Code for IOS:
              </p>
                <button
  onClick={copyText}
  className="cursor-pointer transition 
             hover:bg-red-700 
             active:bg-brand-orange 
             focus:outline-none focus:ring-0
             text-white font-extrabold underline py-2 px-3 rounded"
>
  Kaylhy
</button>
          </div>

          {/* Col 2: Dynamic Courses */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">OUR COURSES</h4>
            <ul className="space-y-2 text-sm text-red-100">
                {footerCourses.length > 0 ? (
                    footerCourses.map((course) => (
                        <li key={course._id}>
                            <Link to={`/courses/${course.slug}`} className="hover:text-white hover:translate-x-1 transition flex items-center">
                                <FaChevronRight className="mr-2 text-brand-orange text-xs flex-shrink-0" /> 
                                <span className="truncate">{course.title}</span>
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>Loading courses...</li>
                )}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-red-100">
                {[
                    {name: 'Selections', link: '/selections'}, // Made lowercase to match App.js
                    {name: 'Schedule Demo', link: '/book-demo'},
                    {name: 'Exam Notification', link: '/notifications'},
                    {name: 'Current Affairs', link: '/current-affairs'} 
                ].map((item, i) => (
                    <li key={i}>
                        {/* Use normal <a> tag if it's an anchor link (/book-demo), otherwise use <Link> */}
                        {item.link.startsWith('#') ? (
                           <a href={item.link} className="hover:text-white hover:translate-x-1 transition flex items-center">
                               <FaChevronRight className="mr-2 text-brand-orange text-xs" /> {item.name}
                           </a>
                        ) : (
                           <Link to={item.link} className="hover:text-white hover:translate-x-1 transition flex items-center">
                               <FaChevronRight className="mr-2 text-brand-orange text-xs" /> {item.name}
                           </Link>
                        )}
                    </li>
                ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h4 className="text-xl font-bold mb-4 text-brand-orange">CONTACT INFO</h4>
            <address className="space-y-3 text-sm not-italic text-red-100">
                <p className="flex items-center"><FaPhoneAlt className="mr-3 text-lg text-brand-orange flex-shrink-0" /> +91 99889 49969</p>
                <p className="flex items-center"><FaWhatsapp className="mr-3 text-lg text-brand-orange flex-shrink-0" /> +91 90419 73105</p>
                <p className="flex items-center"><FaEnvelope className="mr-3 text-lg text-brand-orange flex-shrink-0" /> samarth.academy2006@gmail.com</p>
                <p className="flex items-start"><FaMapMarkerAlt className="mr-3 mt-1 text-lg text-brand-orange flex-shrink-0" /> SCF 68, UT MARKET, Opp. GNDU, AMRITSAR</p>
            </address>
            <div className="mt-3">
              <iframe
                title="Samarth Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1698.5547512529747!2d74.82713965152723!3d31.63085207667954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919657f0eba9491%3A0x6035bb024edd918e!2sSamarth%20Academy%20-%20Best%20SSC%20Banking%20Punjab%20Police%20PSSSB%20IBPS%20IAS%20PCS%20PSTET%20UGC%20coaching!5e0!3m2!1sen!2sin!4v1771949840809!5m2!1sen!2sin"
                className="w-full h-100 rounded-md border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                aria-hidden="false"
              ></iframe>
              <p className="text-xs text-red-100 mt-2">
                <a href="https://maps.app.goo.gl/skvZj9MzW4588etP8" target="_blank" rel="noreferrer" className="underline hover:text-white">View larger map</a>
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-brand-orange py-4 text-center text-sm">
        <p>Copyright &copy; {new Date().getFullYear()} Samarth Academy</p>
      </div>
    </footer>
  );
};

export default Footer;