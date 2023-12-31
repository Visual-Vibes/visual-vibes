// components/ImageGallery.tsx
import React, { useState, useEffect } from "react";

const BackgroundImageSlider = () => {
  const [galleryItem, setGalleryItem] = useState([]);
  const [imageNumber, setImageNumber] = useState(1);
  const [startX, setStartX] = useState(0) //Math.random() * screen.width - 200);
  const [imageLoaded, setImageLoaded] = useState(false); // New state variable
  const [windowHeight, setWindowHeight] = useState(0);
  
  const getGalleryItem = async () => {
    try {
      const response = await fetch("/api/galleryItem", {
          method: "POST",
      });

      if (!response) {
          console.log("Error getting item");
          return { items: [] };
      }
        
      if (response.ok) {
          var responseData = await response.json();
          console.log(responseData);
          setGalleryItem(responseData);
      } else {
          console.error("Error:", response.status, response.statusText);
      }
    }
    catch(error) {
      console.error('Failed to get gallery items:', error);
      throw new Error('Failed to get gallery items');
    }
  };

  useEffect(() => {
    getGalleryItem();
  }, []);

  useEffect(() => {
    setStartX(Math.random() * screen.width - 200);
    setImageNumber(Math.floor(Math.random() * galleryItem.length));
  }, [galleryItem, windowHeight]);

  useEffect(() => {
    setWindowHeight(window.screen.height);
  }, []);

  useEffect(() => {
    let isMounted = true; // Add this line

    const interval = setInterval(() => {
      if (!isMounted) return; // Add this line

      getGalleryItem();
      setStartX(Math.random() * screen.width)
    }, 23000);

    return () => {
      isMounted = false; // Add this line
      clearInterval(interval)
    };
  });

  return (
    <div 
      key={galleryItem[imageNumber]} // Add this line
      style={{ 
        position: 'absolute',
        top: `-200px`,
        left: `${startX}px`,
        animation: imageLoaded ? `move linear 23s infinite` : 'none', // Conditional animation
        transformOrigin: 'top left',
      }} 
      className="flex transition-transform m-2 blur(10px)"
    >
    <img
      src={galleryItem[imageNumber]}
      alt={`Preview ${galleryItem[imageNumber]}`}
      className="w-40 h-40 cursor-pointer ease-in-out transform object-cover"
      draggable="false" // Disable default image drag behavior
      onLoad={() => setImageLoaded(true)} // New event handler
      style={{ filter: 'blur(2px)' }}
    />
    <style jsx>{`
      @keyframes move {
        0% { transform: translate(0px, -200px;) }
        100% { transform: translate(0px, ${windowHeight + 200}px); }
      }
    `}</style>
    </div>
  );
}

export default BackgroundImageSlider;
