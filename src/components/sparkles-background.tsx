"use client"

import React from 'react';

interface SparklesBackgroundProps {
  className?: string;
  particleColor?: string;
}

const SparklesBackground: React.FC<SparklesBackgroundProps> = ({ 
  className = "",
  particleColor = "#ffffff"
}) => {
  return (
    <>
      {/* Base dark background */}
      <div 
        className={`fixed inset-0 z-0 ${className}`}
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)'
        }}
      />
      
      {/* Particles container */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="particle-layer-1" />
        <div className="particle-layer-2" />
        <div className="particle-layer-3" />
        <div className="particle-layer-4" />
      </div>

      <style jsx>{`
        .particle-layer-1 {
          position: absolute;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 
            1920px 400px ${particleColor}, 750px 200px ${particleColor}, 1500px 800px ${particleColor},
            300px 600px ${particleColor}, 1200px 100px ${particleColor}, 600px 900px ${particleColor},
            900px 300px ${particleColor}, 1800px 700px ${particleColor}, 450px 500px ${particleColor},
            1650px 250px ${particleColor}, 800px 750px ${particleColor}, 1100px 950px ${particleColor},
            350px 150px ${particleColor}, 1750px 450px ${particleColor}, 650px 350px ${particleColor},
            1450px 650px ${particleColor}, 200px 850px ${particleColor}, 1350px 50px ${particleColor},
            700px 550px ${particleColor}, 1600px 850px ${particleColor}, 400px 250px ${particleColor},
            1000px 450px ${particleColor}, 1400px 150px ${particleColor}, 550px 750px ${particleColor},
            1700px 550px ${particleColor}, 250px 950px ${particleColor}, 1550px 350px ${particleColor},
            850px 650px ${particleColor}, 1300px 750px ${particleColor}, 500px 50px ${particleColor},
            1150px 850px ${particleColor}, 750px 450px ${particleColor}, 1850px 250px ${particleColor},
            150px 650px ${particleColor}, 1250px 450px ${particleColor}, 950px 150px ${particleColor},
            1500px 950px ${particleColor}, 300px 350px ${particleColor}, 1050px 550px ${particleColor},
            1650px 750px ${particleColor}, 450px 850px ${particleColor}, 1800px 150px ${particleColor},
            100px 450px ${particleColor}, 1200px 650px ${particleColor}, 800px 250px ${particleColor},
            1450px 850px ${particleColor}, 350px 950px ${particleColor}, 1350px 350px ${particleColor},
            650px 150px ${particleColor}, 1750px 950px ${particleColor}, 400px 550px ${particleColor};
          border-radius: 50%;
          animation: animParticle 60s linear infinite;
        }

        .particle-layer-1:after {
          content: "";
          position: absolute;
          top: 100vh;
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 
            1600px 300px ${particleColor}, 900px 100px ${particleColor}, 1300px 700px ${particleColor},
            500px 500px ${particleColor}, 1000px 900px ${particleColor}, 700px 200px ${particleColor},
            1700px 600px ${particleColor}, 200px 800px ${particleColor}, 1500px 150px ${particleColor},
            800px 650px ${particleColor}, 1200px 250px ${particleColor}, 450px 750px ${particleColor},
            1800px 350px ${particleColor}, 350px 950px ${particleColor}, 1100px 550px ${particleColor},
            600px 50px ${particleColor}, 1650px 450px ${particleColor}, 750px 850px ${particleColor},
            1400px 750px ${particleColor}, 250px 150px ${particleColor}, 1550px 550px ${particleColor},
            950px 350px ${particleColor}, 1250px 950px ${particleColor}, 550px 650px ${particleColor};
          border-radius: 50%;
        }

        .particle-layer-2 {
          position: absolute;
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 
            1800px 200px ${particleColor}, 600px 600px ${particleColor}, 1400px 900px ${particleColor},
            400px 100px ${particleColor}, 1100px 400px ${particleColor}, 850px 700px ${particleColor},
            1650px 500px ${particleColor}, 300px 300px ${particleColor}, 1350px 800px ${particleColor},
            750px 150px ${particleColor}, 1750px 650px ${particleColor}, 150px 950px ${particleColor},
            1050px 350px ${particleColor}, 950px 750px ${particleColor}, 1500px 50px ${particleColor},
            500px 850px ${particleColor}, 1200px 550px ${particleColor}, 700px 950px ${particleColor},
            1600px 250px ${particleColor}, 350px 450px ${particleColor}, 1450px 350px ${particleColor},
            800px 550px ${particleColor}, 1300px 150px ${particleColor}, 650px 750px ${particleColor};
          border-radius: 50%;
          animation: animParticle 120s linear infinite;
        }

        .particle-layer-2:after {
          content: "";
          position: absolute;
          top: 100vh;
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 
            1700px 400px ${particleColor}, 450px 200px ${particleColor}, 1250px 800px ${particleColor},
            750px 600px ${particleColor}, 1550px 100px ${particleColor}, 250px 700px ${particleColor},
            1150px 300px ${particleColor}, 550px 950px ${particleColor}, 1850px 500px ${particleColor},
            100px 350px ${particleColor}, 1000px 750px ${particleColor}, 900px 50px ${particleColor};
          border-radius: 50%;
        }

        .particle-layer-3 {
          position: absolute;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            1900px 300px ${particleColor}, 700px 700px ${particleColor}, 1200px 100px ${particleColor},
            300px 500px ${particleColor}, 1600px 800px ${particleColor}, 800px 200px ${particleColor},
            1000px 600px ${particleColor}, 500px 900px ${particleColor}, 1500px 400px ${particleColor},
            200px 250px ${particleColor}, 1400px 650px ${particleColor}, 900px 850px ${particleColor},
            1700px 150px ${particleColor}, 400px 750px ${particleColor}, 1300px 950px ${particleColor},
            600px 350px ${particleColor}, 1800px 550px ${particleColor}, 100px 450px ${particleColor},
            1150px 250px ${particleColor}, 750px 950px ${particleColor}, 1450px 50px ${particleColor},
            350px 650px ${particleColor}, 1650px 850px ${particleColor}, 550px 150px ${particleColor},
            1050px 750px ${particleColor}, 850px 450px ${particleColor}, 1550px 250px ${particleColor},
            250px 850px ${particleColor}, 1250px 550px ${particleColor}, 950px 50px ${particleColor};
          border-radius: 50%;
          animation: animParticle 180s linear infinite;
        }

        .particle-layer-3:after {
          content: "";
          position: absolute;
          top: 100vh;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            1750px 200px ${particleColor}, 450px 600px ${particleColor}, 1350px 900px ${particleColor},
            650px 100px ${particleColor}, 1500px 500px ${particleColor}, 150px 800px ${particleColor},
            1100px 300px ${particleColor}, 850px 700px ${particleColor}, 1850px 400px ${particleColor},
            300px 950px ${particleColor}, 1200px 150px ${particleColor}, 750px 550px ${particleColor},
            1650px 750px ${particleColor}, 400px 350px ${particleColor}, 1000px 850px ${particleColor},
            550px 250px ${particleColor}, 1400px 450px ${particleColor}, 200px 650px ${particleColor};
          border-radius: 50%;
        }

        .particle-layer-4 {
          position: absolute;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            1600px 400px ${particleColor}, 800px 800px ${particleColor}, 1100px 200px ${particleColor},
            400px 600px ${particleColor}, 1700px 900px ${particleColor}, 900px 100px ${particleColor},
            1300px 500px ${particleColor}, 600px 750px ${particleColor}, 1800px 350px ${particleColor},
            300px 150px ${particleColor}, 1500px 700px ${particleColor}, 750px 950px ${particleColor},
            1200px 50px ${particleColor}, 500px 450px ${particleColor}, 1650px 650px ${particleColor},
            200px 850px ${particleColor}, 1450px 250px ${particleColor}, 700px 550px ${particleColor},
            1050px 950px ${particleColor}, 850px 350px ${particleColor}, 1750px 750px ${particleColor},
            450px 50px ${particleColor}, 1350px 450px ${particleColor}, 550px 650px ${particleColor},
            1000px 150px ${particleColor}, 950px 550px ${particleColor}, 1550px 850px ${particleColor},
            350px 250px ${particleColor}, 1250px 750px ${particleColor}, 650px 950px ${particleColor},
            1400px 150px ${particleColor}, 150px 550px ${particleColor}, 1150px 350px ${particleColor},
            800px 650px ${particleColor}, 1850px 850px ${particleColor}, 250px 750px ${particleColor};
          border-radius: 50%;
          animation: animParticle 200s linear infinite;
        }

        .particle-layer-4:after {
          content: "";
          position: absolute;
          top: 100vh;
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            1500px 300px ${particleColor}, 700px 700px ${particleColor}, 1250px 100px ${particleColor},
            350px 500px ${particleColor}, 1550px 800px ${particleColor}, 250px 200px ${particleColor},
            1050px 600px ${particleColor}, 750px 900px ${particleColor}, 1750px 400px ${particleColor},
            450px 950px ${particleColor}, 1200px 250px ${particleColor}, 600px 650px ${particleColor};
          border-radius: 50%;
        }

        @keyframes animParticle {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-100vh);
          }
        }
      `}</style>
    </>
  );
};

export default SparklesBackground;
