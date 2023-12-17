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

  return (
    <div>
      <FloatingBackground />
      <div className="flex flex-row justify-center items-center z-10">
        <Clock hourCount={hourCount} setHourCount={setHourCount} />
        <WelcomeImage hourCount={hourCount} />
      </div>
    </div>
  );
}
