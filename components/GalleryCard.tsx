import React from "react";
import Image from "next/image";

export interface GalleryCardProps {
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
    <div className=" bg-gray-700 max-w-sm rounded overflow-hidden shadow-lg p-2 mb-8">
      <div className="font-bold text-center text-white text-2xl mb-2">
        {label}
      </div>

      <Image
        className="w-full"
        src={imageSrc}
        alt={label}
        width={500}
        height={500}
      />
      <div className="px-6 py-4">
        <p className="text-gray-200 text-base">{description}</p>
      </div>
    </div>
  );
};

export default GalleryCard;
