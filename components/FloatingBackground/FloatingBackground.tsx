import PublicGallery from "@/components/PublicGallery";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import BackgroundImageSlider from "@/components/BackgroundImageSlider";

export const revalidate = 0;

export default function FloatingBackground() {
    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    let randomValues = [];
      
    for (let i = 0; i < 5; i++) {
      randomValues.push(getRandomInt(0, 1024));
    }

    const [galleryItems, setGalleryItems] = useState([]);
    const [xValues, setXValues] = useState(randomValues);

    const getGalleryItems = async () => {
      try {
        const response = await fetch("/api/galleryItems", {
            method: "POST",
        });

        if (!response) {
            console.log("Error getting items");
            return { items: [] };
        }
          
        if (response.ok) {
            var responseData = await response.json();
            console.log(responseData);
            console.log('test')
            setGalleryItems(responseData);
            // setXValues([0,0,0,0])
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
      const interval = setInterval(() => {
        setXValues((prevXValues: any) =>  {
          return prevXValues.map((v: any) => {
            if (v > window.innerWidth + 500 ) {
              return -500;
            }
            return v + 1;
          })
        });
      }, 1);

      getGalleryItems();

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log(`xValues: ${xValues}`);
    }, [xValues]);

    return (
      <div className="fixed top-0 left-0 py-4 w-full h-full z-negative10 pointer-events-none">
        {galleryItems && galleryItems.map((imageUrlList, index) => (
          <div key={index} style={{ transform: `translateX(${xValues[index]}px)`, transition: 'opacity', margin: '10px', filter: 'blur(2px)' }}>
            <BackgroundImageSlider imageUrls={imageUrlList} />
          </div>
        ))}
      </div>
    );
};
