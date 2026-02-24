import React from 'react';

const Map = ({ 
  embedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1698.5547512529747!2d74.82713965152723!3d31.63085207667954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919657f0eba9491%3A0x6035bb024edd918e!2sSamarth%20Academy%20-%20Best%20SSC%20Banking%20Punjab%20Police%20PSSSB%20IBPS%20IAS%20PCS%20PSTET%20UGC%20coaching!5e0!3m2!1sen!2sin!4v1771949840809!5m2!1sen!2sin", 
  mapLink = "https://maps.app.goo.gl/skvZj9MzW4588etP8",
  className = "mt-4 flex flex-col items-center justify-center w-full"
}) => {
  return (
    <div className={className}>
      {/* Map Iframe */}
      <iframe
        title="Samarth Academy Location"
        src={embedSrc}
        className="w-full max-w-sm md:max-w-md h-96 rounded-xl border-0 shadow-md"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-hidden="false"
      ></iframe>
      
      {/* Box Button for "View larger map" */}
      <a 
        href={mapLink} 
        target="_blank" 
        rel="noreferrer" 
        className="mt-4 px-5 py-2.5 bg-red-700 border border-red-700 hover:bg-white/30 hover:text-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm text-center backdrop-blur-sm"
      >
        View larger map
      </a>
      <br />
    
    </div>
    
  );
};

export default Map;