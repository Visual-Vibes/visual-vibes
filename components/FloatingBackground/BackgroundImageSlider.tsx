// components/ImageGallery.tsx
import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

const BackgroundImageSlider: React.FC<{ imageUrls: string[] }> = ({ imageUrls }) => {
  const [yPos, setYPos] = useState(0);
  useEffect(() => {

    // Start scrolling
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 5; // Adjust the scrolling speed as needed
      }
    }, 20); // Adjust the interval for smoother or faster scrolling

    if (sliderRef.current) {
      sliderRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      clearInterval(interval);
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [duplicatedImageUrls]);

  return (
    <div className="bg-gray-800 w-1/5 overflow-hidden">
      <div className="flex flex-col space-y-2">
        <div
          className="m-auto flex space-x-4 p-10 relative"
          ref={sliderRef}
        >
          {duplicatedImageUrls.map((imageUrl, index) => (
            <img
              key={index}
              id={`image-${index}`}
              src={imageUrl}
              alt={`Preview ${index}`}
              className={`w-40 h-40 cursor-pointer ease-in-out transform hover:scale-105 hover:shadow-xl ${
                hoveredImage === index ? "ring-2 ring-blue-500" : ""
              }`}
              draggable="false" // Disable default image drag behavior
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default BackgroundImageSlider;
