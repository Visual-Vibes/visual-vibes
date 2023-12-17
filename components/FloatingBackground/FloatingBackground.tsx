import { useState, useEffect, ReactElement } from "react";
import BackgroundImageSlider from "@/components/FloatingBackground/BackgroundImageSlider";

export const revalidate = 0;

export default function FloatingBackground() {
  const [components, setComponents] = useState<ReactElement[]>([<BackgroundImageSlider key={`background-slider-${0}`}/>]);

    useEffect(() => {
      let numImages = 0
      const interval = setInterval(() => {
          if (numImages < 10) {
            setComponents(prevComponents => [
            ...prevComponents, 
            <BackgroundImageSlider 
              key={`background-slider-${prevComponents.length}`}
            />
          ]);
        }
        numImages++; // Increment the counter
        console.log(numImages);
      }, 4000); // Adjust the interval as needed

        return () => clearInterval(interval); // Clear interval on component unmount
      }, []);

    return (
      <div className="fixed top-0 left-0 py-4 w-full h-full z-negative10 pointer-events-none">
        {components}
      </div>
    );
};
