import React, { useState, useEffect } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { id: 1, title: 'Civil Services', badge: 'bg-brand-red', image: '/images/indian-civil-service.png' },
    { id: 2, title: 'Bank PO/Clerk', badge: 'bg-brand-orange', image: '/images/rbi-logo.jpg' }, // Update path
    { id: 3, title: 'Defence Forces', badge: 'bg-green-600', image: '/images/indian-army.jpg' }, // Update path
    { id: 4, title: 'Police Reforms', badge: 'bg-green-600', image: '/images/indian-police.jpg' },
    { id: 4, title: 'Police Reforms', badge: 'bg-green-600', image: '/images/indian-police.jpg' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <header id="hero" className="relative overflow-hidden bg-brand-red pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-orange/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Side: Content */}
        <div className="lg:w-1/2 mb-12 lg:mb-0 text-white z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-brand-orange"></span> #1 Institute in Amritsar
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up tracking-tight" style={{ animationDelay: '0.2s' }}>
            Crack Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-orange">Dream Exam</span>
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-8 max-w-lg animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Master Banking, SSC, and State exams with Samarth Academy's proven pedagogy and expert mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a href="#contact" className="px-8 py-4 bg-white text-brand-red font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all text-center">
              Start Learning
            </a>
            <a href="tel:+919988949969" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2">
              <FaPhoneAlt /> +91 99889 49969
            </a>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="lg:w-5/12 w-full relative z-10 animate-float">
            <div className="relative">
                 {/* Decorative Rings */}
                <div className="absolute -inset-4 border-2 border-white/20 rounded-3xl transform rotate-3"></div>
                <div className="absolute -inset-4 border-2 border-brand-orange/30 rounded-3xl transform -rotate-3"></div>

                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden h-[400px] relative">
                    {slides.map((slide, index) => (
                    <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Use placeholders if images missing */}
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-90" onError={(e) => e.target.src='https://placehold.co/600x400/222/fff?text=Slide+Image'} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6">
                            <span className={`${slide.badge} text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block`}>TARGET</span>
                            <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;