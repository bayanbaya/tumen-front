"use client";

import SectionTitle from "../Common/SectionTitle";
import SingleTicket from "./SingleTicket";
import ticketData from "./ticketData";

const Ticket = () => {
  // Generate deterministic particle positions based on index
  const getParticleStyle = (index: number) => {
    // Use a seeded random-like function based on index for consistent values
    const seed = (index * 9301 + 49297) % 233280;
    const seededRandom1 = (seed / 233280.0);
    const seededRandom2 = ((seed * 2) % 233280) / 233280.0;
    const seededRandom3 = ((seed * 3) % 233280) / 233280.0;
    const seededRandom4 = ((seed * 4) % 233280) / 233280.0;

    return {
      left: `${seededRandom1 * 100}%`,
      top: `${seededRandom2 * 100}%`,
      animation: `float ${5 + seededRandom3 * 10}s ease-in-out infinite`,
      animationDelay: `${seededRandom4 * 5}s`
    };
  };

  return (
    <section
      id="Азтангууд"
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black py-24 md:py-32 lg:py-40 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"
            style={getParticleStyle(i)}
          />
        ))}
      </div>
      
      <div className="container relative z-10">
        <div className="text-center mb-4">
          {/* Main title with gradient and animation */}
          <h3 className="text-4xl md:text-4xl lg:text-5xl font-black mb-0 leading-none" style={{ fontFamily: 'var(--font-vollkorn), serif' }}>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient">
              СУПЕР
            </span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 dark:from-pink-400 dark:via-red-400 dark:to-orange-400 animate-gradient">
              Азтангууд
            </span>
          </h3>
          
          {/* Decorative line */}
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-12 xl:grid-cols-3">
          {ticketData.map((ticket, index) => (
            <div 
              key={ticket.id} 
              className="w-full"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <SingleTicket ticket={ticket} />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Ticket;