"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic

// Custom Components
import Clock from "@/components/Clock";

// Use dynamic imports for FloatingBackground and WelcomeImage
const FloatingBackground = dynamic(
  () => import('@/components/FloatingBackground/FloatingBackground'),
  { ssr: false }
);

const WelcomeImage = dynamic(
  () => import('@/components/WelcomeImage'),
  { ssr: false }
);


export default function Home() {
  const [hourCount, setHourCount] = useState(6);
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
    <div className="">
      <FloatingBackground />
      <div className="z-20 relative">
        <div className="flex flex-col">
          <div className="mt-10 mx-auto rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-gray-900">
            <div className="relative p-8 pt-2 pb-8 shadow-xl rounded-xl font-semibold m-3 bg-gray-800">
              <div style={{ filter: `hue-rotate(${hue}deg)` }} className="text-4xl p-3 text-purple-400">Visual Vibes</div>
            <div>
              <p className="text-2xl font-semibold text-gray-300 mt-4 mb-2">Transform everyday objects into characters living a human life!</p>
              </div>
            </div>

            <Link 
                style={{ filter: `hue-rotate(${hue}deg)` }}
                href="/howitworks"
                className="flex w-full h-full px-8 bg-purple-500 text-white font-semibold py-2 rounded hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300 focus:ring-opacity-50"
            >
              Click here to get started! &rarr;
            </Link>
          </div>
        </div>
                
        <div className="flex flex-row justify-center items-center z-10">
          <Clock hourCount={hourCount} setHourCount={setHourCount} />
          <WelcomeImage hourCount={hourCount} />
        </div>
      </div>
    </div>
  );
}


             
