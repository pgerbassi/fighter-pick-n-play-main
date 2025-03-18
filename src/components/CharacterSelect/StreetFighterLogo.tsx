
import React from 'react';

const StreetFighterLogo: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative transform scale-75 md:scale-100">
        {/* Street Fighter Text with gradient */}
        <div className="text-center">
          <h1 className="fighting-title text-5xl md:text-6xl inline-block whitespace-nowrap" 
            style={{
              background: "linear-gradient(to bottom, #ffeb3b 0%, #ff9800 40%, #ff5722 80%, #f44336 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 3px 0 #000, 0 0 10px rgba(0,0,0,0.8)",
              transform: "skew(-10deg, 0deg) perspective(100px) rotateX(10deg)",
              letterSpacing: "-2px",
              paddingLeft: "20px"
            }}
          >
            ESTRETA FIGHTER
          </h1>
        </div>
        
        {/* The "II" with different style */}
        <div className="absolute -right-6 md:right-0 bottom-0 md:-bottom-2">
          <span className="fighting-title text-4xl md:text-5xl inline-block" 
            style={{
              background: "linear-gradient(to bottom, #ff5722 0%, #d32f2f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 0 #000, 0 0 10px rgba(0,0,0,0.8)",
              transform: "skew(-5deg, 0deg)",
            }}
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreetFighterLogo;
