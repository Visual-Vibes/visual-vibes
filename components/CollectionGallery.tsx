import { CollectionItems } from "@/app/gallery/[collection]/page";
import React from "react";
import Image from "next/image";

const CollectionGallery: React.FC<CollectionItems> = ({ imageUrls, label }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {imageUrls.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <Image
            src={imageUrl}
            alt=""
            layout="responsive"
            width={100}
            height={100}
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
};

export default CollectionGallery;
