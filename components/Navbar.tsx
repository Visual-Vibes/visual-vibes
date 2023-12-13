import { FaHome } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";

import IconLink from "./IconLink";

export default function Navbar() {
  return (
    <div className="flex flex-col space-y-2 m-4 w-1/6">
      <IconLink Icon={FaHome} href="/" label="Home" />
      <IconLink Icon={FaTools} href="/vibes" label="Make the Vibes" />
      <IconLink Icon={GrGallery} href="/gallery" label="Public Gallery" />
    </div>
  );
}
