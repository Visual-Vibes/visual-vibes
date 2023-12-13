import React from "react";
import Image from "next/image";

interface GalleryCardProps {
  label: string;
  imageSrc: string; // Will be a public URL from the supabase storage buckets
  description: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  label,
  imageSrc,
  description,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image
        className="w-full"
        src={imageSrc}
        alt={label}
        width={500}
        height={500}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{label}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
};

export default GalleryCard;
