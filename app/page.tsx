"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";

// Custom Components
import Clock from "@/components/Clock";
import WelcomeImage from "@/components/WelcomeImage";

// const getWelcomeImages = async () => {
//   const response = await fetch("/api/getWelcomeImages", {
//     method: "GET",
//   });
//   const data = await response.json();
//   return data;
// };

export default function Home() {
  const [hourCount, setHourCount] = useState(6);

  // const res = await getWelcomeImages();
  // const imageUrls = res.imageUrls;
  // const imageNames = res.imageNames;

  return (
    <div className="flex flex-col space-y-10 justify-center items-center">
      <Clock hourCount={hourCount} setHourCount={setHourCount} />
      <WelcomeImage hourCount={hourCount} />
    </div>
  );
}
