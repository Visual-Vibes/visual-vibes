// components/ImageGallery.tsx
import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

const ImageSlider: React.FC<{ imageUrls: string[] }> = ({ imageUrls }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Duplicate the images to create a seamless loop
  const duplicatedImageUrls = [...imageUrls, ...imageUrls];

  const downloadAllImages = async () => {
    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imgFolder!.file(`Image${i + 1}.jpg`, blob, { binary: true });
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });
  };

  const downloadImage = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, filename);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth;
        const scrollLeft = sliderRef.current.scrollLeft;

        // Calculate the visible region and the middle of the visible region
        const visibleRegion = containerWidth;
        const middleRegion = visibleRegion / 2;

        // Update opacity based on image position relative to the middle
        duplicatedImageUrls.forEach((imageUrl, index) => {
          const image = document.getElementById(`image-${index}`);
          if (image) {
            const imageLeft = image.offsetLeft - scrollLeft;
            const distanceToMiddle = Math.abs(imageLeft - middleRegion);

            // Linear interpolation for opacity between 0% and 100% based on distance to middle
            const opacity = 1 - distanceToMiddle / (visibleRegion / 2);
            image.style.opacity = opacity.toString();
          }
        });

        // Check for reaching the end of the slider and reset to the start
        if (scrollLeft >= sliderRef.current.scrollWidth / 2) {
          sliderRef.current.scrollLeft -= sliderRef.current.scrollWidth / 2;
        }
      }
    };

    // Start scrolling
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 1; // Adjust the scrolling speed as needed
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

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleModalClick = () => {
    setSelectedImage(null);
  };

  const handleHoverStart = (index: number) => {
    setHoveredImage(index);
  };

  const handleHoverEnd = () => {
    setHoveredImage(null);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (dragStartX !== null && sliderRef.current) {
      const movementX = e.clientX - dragStartX;
      sliderRef.current.scrollLeft -= movementX;
      setDragStartX(e.clientX);
    }
  };

  const handleDragEnd = () => {
    setDragStartX(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="m-auto flex space-x-4 p-10 overflow-x-hidden overflow-y-hidden relative"
        ref={sliderRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
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
            onClick={() => handleImageClick(imageUrl)}
            onMouseEnter={() => handleHoverStart(index)}
            onMouseLeave={handleHoverEnd}
            draggable="false" // Disable default image drag behavior
          />
        ))}

        {selectedImage && (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-75"
            onClick={handleModalClick}
          >
            <Image
              src={selectedImage}
              alt="Full-sized Image"
              height={500}
              width={500}
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal close when clicking the button
                downloadImage(selectedImage, "downloadedImage.jpg");
              }}
              className="absolute bottom-10 p-2 bg-green-500 text-white rounded"
            >
              Download This Image
            </button>
          </div>
        )}
      </div>
      <button
        onClick={downloadAllImages}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Download All Images
      </button>
    </div>
  );
};

export default ImageSlider;
