import React from 'react';
import { FaBullseye, FaEye, FaQuoteLeft } from 'react-icons/fa';
import { useScrollReveal } from '../hooks';

const AboutUs = () => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <header className="relative pt-16 pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className={`lg:w-1/2 z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-brand-orange font-bold tracking-widest text-sm uppercase mb-4 block">Since 2006</span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1]">
                We Build <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Officers</span>
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-brand-red/20 -z-0"></span>
                </span> <br />
                Not Just Students.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                Samarth Academy isn't just a coaching centre; it's a launchpad for dreams. For nearly two decades, we've been the silent force behind thousands of government success stories in Punjab.
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition shadow-xl">Our Story</button>
                <div className="flex items-center -space-x-4">
                   {/* Place images in public/images/team/ */}
                   <img src="/images/team/1.jpg" alt="Student" className="w-12 h-12 rounded-full border-2 border-white object-cover" onError={(e)=>e.target.src='https://placehold.co/100'} />
                   <img src="/images/team/2.jpg" alt="Student" className="w-12 h-12 rounded-full border-2 border-white object-cover" onError={(e)=>e.target.src='https://placehold.co/100'} />
                   <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold">+2k</div>
                </div>
              </div>
            </div>

            {/* Image/Graphic Content */}
            <div className="lg:w-1/2 relative">
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-brand-red/10 to-brand-orange/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
               <div className="grid grid-cols-2 gap-4">
                  <img src="/images/about/classroom.jpg" alt="Classroom" className="rounded-2xl shadow-2xl mt-12 transform -rotate-2 hover:rotate-0 transition duration-500" onError={(e)=>e.target.src='https://placehold.co/400x500'} />
                  <img src="/images/about/library.jpg" alt="Library" className="rounded-2xl shadow-2xl mb-12 transform rotate-2 hover:rotate-0 transition duration-500" onError={(e)=>e.target.src='https://placehold.co/400x500'} />
               </div>
               <div className="absolute top-10 right-0 bg-white p-4 rounded-xl shadow-xl animate-bounce">
                  <p className="text-4xl font-black text-brand-red">19+</p>
                  <p className="text-xs text-gray-500 font-bold uppercase">Years of Excellence</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mission & Vision */}
      <section ref={ref} className={`py-20 bg-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 relative">
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-orange/20 rounded-full"></div>
                    <img src="/images/about/vision.jpg" alt="Vision" className="rounded-tr-[100px] rounded-bl-[100px] rounded-tl-2xl rounded-br-2xl shadow-2xl relative z-10 w-full" onError={(e)=>e.target.src='https://placehold.co/800x600'} />
                </div>
                <div className="order-1 md:order-2">
                    <h4 className="text-brand-red font-bold text-lg mb-2">The Samarth Philosophy</h4>
                    <h2 className="text-4xl font-black text-gray-900 mb-6">Bridging the Gap Between <br /> <span className="text-brand-orange underline decoration-4 decoration-brand-orange/30">Ambition & Reality</span></h2>
                    
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-red text-xl"><FaBullseye /></div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed mt-2">To provide affordable, accessible, and high-quality coaching to every aspirant in Punjab.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 text-brand-orange text-xl"><FaEye /></div>
                            <div>
                                <h3 className="font-bold text-xl text-gray-900">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed mt-2">To be the most trusted name in government exam preparation, known for building character and discipline.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Director Note */}
      <section className="py-20 bg-brand-bg relative overflow-hidden">
         <div className="absolute top-0 right-0 text-[20rem] leading-none text-brand-red/5 font-serif select-none pointer-events-none"><FaQuoteLeft /></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full p-1 border-2 border-brand-red">
                <img src="/images/about/director.jpg" alt="Director" className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition duration-500" onError={(e)=>e.target.src='https://placehold.co/150'} />
            </div>
            <h3 className="text-2xl font-serif italic text-gray-800 mb-6 leading-relaxed max-w-4xl mx-auto">
                "Education is not just about clearing an exam; it is about empowering a generation to serve the nation. At Samarth, we don't just teach subjects; we teach the art of perseverance."
            </h3>
            <div className="flex flex-col items-center">
                <span className="font-black text-brand-red text-lg uppercase tracking-wider">Sidharth Sir</span>
                <span className="text-sm font-medium text-gray-500">Ex-Bank Officer & Founder</span>
            </div>
         </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900">Our Journey</h2>
                <p className="text-gray-500 mt-2">A legacy of trust and results.</p>
            </div>
            <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-100"></div>
                {/* Year 1 */}
                <div className="relative flex items-center justify-between mb-12">
                    <div className="w-5/12 text-right pr-8">
                        <h3 className="text-2xl font-black text-brand-red">2006</h3>
                        <p className="text-gray-600 text-sm">Foundation laid in Amritsar with a small batch of 10 students.</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-brand-orange rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-5/12 pl-8"></div>
                </div>
                {/* Year 2 */}
                <div className="relative flex items-center justify-between mb-12">
                    <div className="w-5/12 text-right pr-8"></div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-brand-red rounded-full shadow-lg"></div>
                    <div class="w-5/12 pl-8">
                        <h3 class="text-2xl font-black text-brand-red">2012</h3>
                        <p class="text-gray-600 text-sm">Expanded to Banking & SSC wings. First All India Rank achieved.</p>
                    </div>
                </div>
                {/* Year 3 */}
                <div className="relative flex items-center justify-between">
                    <div className="w-5/12 text-right pr-8">
                        <h3 className="text-2xl font-black text-brand-red">2025</h3>
                        <p className="text-gray-600 text-sm">Leading institute in North India with 1000+ selections annually.</p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-brand-orange rounded-full border-4 border-white shadow-lg"></div>
                    <div className="w-5/12 pl-8"></div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;