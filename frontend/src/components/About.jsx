import React from 'react';
import { 
  FaLandmark, FaChartLine, FaUsers, FaBookReader, 
  FaCheckCircle, FaQuoteLeft, FaAward, FaUserTie
} from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* --- HERO SECTION --- */}
      <header className="relative bg-brand-red pt-24 pb-32 overflow-hidden text-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-4xl">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-brand-orange font-bold text-xs mb-6 tracking-widest uppercase shadow-sm backdrop-blur-sm">
            About Samarth Academy
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Excellence in Government <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-300">Exam Preparation</span>
          </h1>
          <p className="text-red-50 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            Founded and led by experienced former government officers, Samarth Academy is built on the principle that competitive exam preparation is not merely coaching — it is <span className="text-white font-bold border-b-2 border-brand-orange pb-0.5">structured transformation.</span>
          </p>
        </div>
      </header>

      {/* --- INTRO SECTION --- */}
      <section className="container mx-auto px-4 max-w-6xl -mt-16 relative z-20 mb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 text-center">
            <FaLandmark className="text-5xl text-gray-200 mx-auto mb-6" />
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-medium">
                Samarth Academy, Amritsar, is a premier institute dedicated to preparing aspirants for prestigious government examinations with precision, discipline, and strategic mentorship. 
                We combine academic expertise, administrative experience, and result-oriented systems to develop confident, capable, and disciplined future officers.
            </p>
        </div>
      </section>

      {/* --- LEADERSHIP SECTION --- */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Leadership That Understands the System</h2>
            <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Sidharth Khanna Profile */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
                <div className="p-8 md:p-10 flex-grow">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                        {/* Placeholder for real photo */}
                        <div className="w-32 h-32 rounded-2xl bg-gray-100 border-4 border-gray-50 shadow-inner flex-shrink-0 overflow-hidden relative">
                            <FaUserTie className="text-6xl text-gray-300 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2" />
                            {/* <img src="/path-to-sidharth-photo.jpg" alt="Sidharth Khanna" className="w-full h-full object-cover" /> */}
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">Sidharth Khanna</h3>
                            <p className="text-brand-red font-bold text-sm uppercase tracking-wider mb-2">Director | Quant Expert</p>
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">
                                Ex-Bank Manager, Bank Of India
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Sidharth brings over a decade of experience in government banking services and competitive exam mentorship. An MBA in Finance from GNDU, he possesses deep insight into financial systems, aptitude mastery, and examination frameworks. 
                        <br/><br/>
                        <span className="font-bold text-gray-800">Cleared:</span> IBPS PO, SBI PO, SSC CGL, PSSSB, UGC NET, JAIIB, CAIIB.
                    </p>

                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaChartLine className="text-brand-red"/> His structured methodology emphasizes:</h4>
                    <ul className="space-y-3">
                        {["Analytical thinking and speed optimization", "Advanced quantitative aptitude for SSC, Banking, and State Exams", "Performance tracking and measurable improvement systems", "Professional discipline aligned with officer-level expectations"].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                    <p className="text-brand-red font-bold italic">"Preparation is treated as a strategic process — not guesswork."</p>
                </div>
            </div>

            {/* Deepika Dhir Profile */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
                <div className="p-8 md:p-10 flex-grow">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                        {/* Placeholder for real photo */}
                        <div className="w-32 h-32 rounded-2xl bg-gray-100 border-4 border-gray-50 shadow-inner flex-shrink-0 overflow-hidden relative">
                            <FaUserTie className="text-6xl text-gray-300 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2" />
                            {/* <img src="/path-to-deepika-photo.jpg" alt="Deepika Dhir" className="w-full h-full object-cover" /> */}
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-3xl font-black text-gray-900 mb-2">Deepika Dhir</h3>
                            <p className="text-brand-red font-bold text-sm uppercase tracking-wider mb-2">Director | GS Expert</p>
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200">
                                Ex-GST & Customs Inspector
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Deepika is a distinguished General Studies mentor with more than 12 years of experience in competitive examination training. Having served as a GST & Customs Inspector under the Government of India, she provides a highly administrative perspective to her teachings.
                        <br/><br/>
                        <span className="font-bold text-gray-800">Cleared:</span> UGC NET, SSC CGL, IBPS PO, and multiple state-level exams.
                    </p>

                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaBookReader className="text-brand-red"/> Her expertise spans:</h4>
                    <ul className="space-y-3">
                        {["Indian Polity and Governance", "History and Geography", "Indian Economy", "General Science and Current Affairs"].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                                <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                    <p className="text-brand-red font-bold italic">"Conceptual clarity combined with practical governance understanding."</p>
                </div>
            </div>

        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="bg-gray-900 py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red rounded-full filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange rounded-full filter blur-[100px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left side text */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Institutional Philosophy</h2>
                    <p className="text-gray-400 text-lg mb-8">At Samarth Academy, preparation is designed around three unshakeable pillars:</p>
                    
                    <div className="flex flex-wrap gap-4 mb-10">
                        {['Strategy', 'Structure', 'Accountability'].map((pillar, i) => (
                            <span key={i} className="bg-white/10 border border-white/20 text-white font-black text-lg px-6 py-3 rounded-xl backdrop-blur-sm uppercase tracking-widest">
                                {pillar}
                            </span>
                        ))}
                    </div>

                    <div className="bg-brand-red/10 border-l-4 border-brand-red p-6 rounded-r-2xl">
                        <FaQuoteLeft className="text-brand-red text-2xl mb-3" />
                        <p className="text-xl text-white font-medium leading-relaxed italic">
                            "We do not operate as a mass coaching center. We operate as a performance-driven academic institution."
                        </p>
                    </div>
                </div>

                
                {/* Right side list */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">We strictly maintain:</h3>
                    <ul className="space-y-6">
                        {[
                            { title: "Limited batch strength", desc: "For focused, individualized mentoring." },
                            { title: "One-to-one doubt resolution", desc: "Dedicated systems to clear every concept." },
                            { title: "Performance audits", desc: "Regular mock evaluations to track actual progress." },
                            { title: "Structured study plans", desc: "Strictly aligned with official exam patterns." },
                            { title: "Ethical academic culture", desc: "Instilling discipline required for government service." }
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="bg-brand-red/20 text-brand-red p-2 rounded-lg mt-1">
                                    <FaAward />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
      </section>

      {/* --- VISION & STANDARD --- */}
      <section className="container mx-auto px-4 max-w-5xl py-24 text-center">
        
        <FaUsers className="text-5xl text-brand-red mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Our Vision & The Samarth Standard</h2>
        
        <p className="text-xl text-gray-600 leading-relaxed font-medium mb-12">
            Our vision is to develop competent government officers who contribute meaningfully to society while building stable and respectable careers within India. We are committed to empowering youth in Punjab through high-quality preparation rooted in integrity, discipline, and measurable results.
        </p>
       <section className="py-20 bg-brand-bg relative overflow-hidden">
                <div className="absolute top-0 right-0 text-[20rem] leading-none text-brand-red/5 font-serif select-none pointer-events-none"><FaQuoteLeft /></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                   
                   <h3 className="text-2xl font-serif italic text-gray-800 mb-6 leading-relaxed max-w-4xl mx-auto">
                       "Education is not just about clearing an exam; it is about empowering a generation to serve the nation. At Samarth, we don't just teach subjects; we teach the art of perseverance."
                   </h3>
                   <div className="flex flex-col items-center">
                       <span className="font-black text-brand-red text-lg uppercase tracking-wider">Sidharth Sir</span>
                       <span className="text-sm font-medium text-gray-500">Ex-Bank Officer & Founder</span>
                   </div>
                </div>
             </section>
              <br />
              <br />

        <div className="bg-brand-red text-white rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-[50px]"></div>
            
            <h3 className="text-2xl font-black mb-4 relative z-10">Choosing Samarth Academy means...</h3>
            <p className="text-red-100 text-lg md:text-xl leading-relaxed relative z-10 max-w-3xl mx-auto mb-10">
                Choosing leadership that has served within the system, understands its standards, and trains aspirants accordingly. For serious candidates seeking structured preparation under experienced guidance, Samarth Academy represents a professional and dependable pathway to success.
            </p>

            <a href="/book-demo" className="inline-block bg-white text-brand-red font-black text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1 relative z-10">
                Start Your Journey With Us
            </a>
        </div>

      </section>

    </div>
  );
};

export default About;