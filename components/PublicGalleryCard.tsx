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
      <Image
        className="w-full"
        src={imageUrl}
        alt={label}
        width={400}
        height={400}
      />

      <div className="border-t border-purple-500 mt-2">
        <p className="font-bold text-center text-gray-300 text-sm mt-2">
          {label}
        </p>
      </div>

      {/* <div className="px-6 py-4">
        <p className="text-gray-200 text-base">{description}</p>
      </div> */}
    </div>
  );
};

export default PublicGalleryCard;
