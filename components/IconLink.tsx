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
      <div className="flex flex-row items-center space-x-2 text-gray-300 hover:text-purple-500 bg-transparent p-2 rounded-lg whitespace-nowrap">
        <Icon />
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default IconLink;
