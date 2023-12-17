import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-transparent m-4">
      {/* Main Spinner with 33% transparency */}
      <div className="border-t-8 border-blue-500 border-solid rounded-full h-12 w-12 animate-spin opacity-75"></div>
      
      {/* Overlay Spinners with complementary shades and offsets */}
      <div className="border-t-8 border-blue-400 border-solid rounded-full h-12 w-12 absolute animate-spin opacity-75" style={{ animationDelay: '-0.3s' }}></div>
      <div className="border-t-8 border-blue-600 border-solid rounded-full h-12 w-12 absolute animate-spin opacity-75" style={{ animationDelay: '0.3s' }}></div>
    </div>
  );
};

export default LoadingSpinner;
