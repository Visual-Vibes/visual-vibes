"use client";

import React from "react";
import Image from "next/image";
import { Collection } from "@/app/gallery/page";
import { useRouter } from "next/navigation";

const PublicGalleryCard: React.FC<Collection> = ({
  folder,
  label,
  imageUrl,
  description,
}) => {
  const router = useRouter();

  return (
    <div
      className="bg-gray-700 max-w-sm rounded overflow-hidden shadow-lg p-2 mb-8 mx-8 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
      onClick={() => router.push("/gallery/" + folder)}
    >
      <div className="font-bold text-center text-white text-lg mb-2">
        {label}
      </div>

      <Image
        className="w-full"
        src={imageUrl}
        alt={label}
        width={400}
        height={400}
      />
      {/* <div className="px-6 py-4">
        <p className="text-gray-200 text-base">{description}</p>
      </div> */}
    </div>
  );
};

export default PublicGalleryCard;
