"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useState } from "react";

// Custom Components
import Navbar from "@/components/Navbar";
import Clock from "@/components/Clock";

export default function Home() {
  const [hourCount, setHourCount] = useState(6);

  return (
    <div className="flex flex-row items-center">
      <Clock hourCount={hourCount} setHourCount={setHourCount} />
      <div className="text-white ml-20 mr-auto">{hourCount}</div>
    </div>
  );
}
