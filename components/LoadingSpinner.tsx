import React from 'react';
import { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => { 
      setHue(prevHue => (prevHue + 1) % 360);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-transparent m-8 pt-20 pb-8">
      {/* Main Spinner with 33% transparency */}
      <div className="border-t-8 border-purple-500 border-solid rounded-full h-24 w-24 animate-spin opacity-75" style={{ filter: `hue-rotate(${hue}deg)` }}></div>
      
      {/* Overlay Spinners with complementary shades and offsets */}
      <div className="border-t-8 border-purple-400 border-solid rounded-full h-24 w-24 absolute animate-spin opacity-75" style={{ filter: `hue-rotate(${hue}deg)`, animationDelay: '-0.3s' }}></div>
      <div className="border-t-8 border-purple-600 border-solid rounded-full h-24 w-24 absolute animate-spin opacity-75" style={{ filter: `hue-rotate(${hue}deg)`, animationDelay: '0.3s' }}></div>
    </div>
  );
};

export default LoadingSpinner;
