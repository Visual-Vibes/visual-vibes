"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CollectionItems } from "@/app/gallery/[collection]/page";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CollectionGallery: React.FC<CollectionItems> = ({ imageUrls, label }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const downloadImage = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, filename);
      });
  };

  const downloadAllImages = () => {
    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    imageUrls.forEach((url, index) => {
      const filename = `Image${index + 1}.jpg`; // Adjust filename format as needed
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          imgFolder!.file(filename, blob);
          if (index === imageUrls.length - 1) {
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, "images.zip");
            });
          }
        });
    });
  };

  const closeModal = (event: React.MouseEvent) => {
    if (event.currentTarget === event.target) {
      setSelectedImage(null);
    }
  };

  return (
    <>
      <button
        onClick={downloadAllImages}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Download All Images
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <Image
              src={imageUrl}
              alt={label + " - " + index}
              layout="responsive"
              width={100}
              height={100}
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              onClick={() => setSelectedImage(imageUrl)}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div className="bg-white p-4 max-w-3xl max-h-full overflow-auto">
            <Image
              src={selectedImage}
              alt="Selected Image"
              layout="responsive"
              width={100}
              height={100}
              objectFit="contain"
            />
            <button
              onClick={() =>
                downloadImage(
                  selectedImage,
                  "visual-vibes-downloaded-image.jpg"
                )
              }
              className="mt-4 p-2 bg-green-500 text-white rounded"
            >
              Download This Image
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionGallery;
