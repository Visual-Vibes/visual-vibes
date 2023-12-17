"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";

// Custom Components
import Clock from "@/components/Clock";
import WelcomeImage from "@/components/WelcomeImage";

import FloatingBackground from "@/components/FloatingBackground/FloatingBackground";

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
