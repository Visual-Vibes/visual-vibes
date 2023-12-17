import { FaHome } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { FaQuestion } from "react-icons/fa";

import IconLink from "./IconLink";

export default function Navbar() {
  return (
    <div className="flex flex-row space-x-4 mx-0 px-10 py-2 m-4 mt-0 w-100 bg-vgray drop-shadow-xl">
      <p className="flex flex-row items-center space-x-2 text-indigo-400 whitespace-nowrap text-xl "> Visual Vibes </p>
      <IconLink Icon={FaHome} href="/" label="Home" />
      <IconLink Icon={FaTools} href="/vibes" label="Make the Vibes" />
      <IconLink Icon={GrGallery} href="/gallery" label="Public Gallery" />
      <IconLink Icon={FaQuestion} href="/howitworks" label="How It Works" />
    </div>
  );
}
