"use client"
import { FaHome } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { FaQuestion } from "react-icons/fa";
import { useState, useEffect } from "react";
import IconLink from "./IconLink";

export default function Navbar() {
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
    <div className="flex flex-row space-x-4 mx-0 px-10 py-2 m-4 mt-0 w-100 bg-gray-800 drop-shadow-xl position: relative z-10">
      <p style={{ filter: `hue-rotate(${hue}deg)` }} className="flex flex-row items-center space-x-2 text-purple-400 whitespace-nowrap text-xl "> Visual Vibes </p>
      <IconLink Icon={FaHome} href="/" label="Home" />
      <IconLink Icon={FaTools} href="/vibes" label="Make the Vibes" />
      <IconLink Icon={GrGallery} href="/gallery" label="Public Gallery" />
      <IconLink Icon={FaQuestion} href="/howitworks" label="How It Works" />
    </div>
  );
}
