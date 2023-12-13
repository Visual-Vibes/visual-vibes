import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

// Custom Components
import Navbar from "@/components/Navbar";
import Clock from "@/components/Clock";

export default function Home() {
  return (
    <div>
      <div className="flex flex-row">
        <Clock />
      </div>
    </div>
  );
}
