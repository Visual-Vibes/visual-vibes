import Link from "next/link";
import React from "react";

type IconLinkProps = {
  Icon: React.ElementType;
  href: string;
  label: string;
};

const IconLink: React.FC<IconLinkProps> = ({ Icon, href, label }) => {
  return (
    <Link href={href}>
      <div className="flex flex-row items-center space-x-2 text-vvanil bg-transparent p-2 rounded-lg whitespace-nowrap hover:text-vblue">
        <Icon />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default IconLink;
