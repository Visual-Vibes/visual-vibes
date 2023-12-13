'use client'
import React from 'react';
import { useState } from 'react';


export default function Vibes() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUploadedText, setImageUploadedText] = useState('Get started by uploading your image!');
  const checkImageRequirements = (image: any) => {
    // TODO: Implement image req check
    return true;
  }

  const onImageUpload = (e: any) => {
    console.log(e.target.files[0])
    if (checkImageRequirements(e.target.files[0]) == true) {
      setSelectedImage(e.target.files[0])
      setImageUploadedText('Image Upload Success!')
    }
  }

  const runOpenAIGen = () => {
    // TODO: Implement
    window.location.assign('https://placekitten.com/500/');
    console.log('ploob')
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
      <div className="relative bg-zinc-800 px-6 pt-2 pb-8 shadow-xl ring-1 ring-gray-400/10 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="space-y-6 py-8 text-base leading-7 text-white">
          <h2 className="text-yellow-400">{imageUploadedText}</h2>

          {selectedImage && (
            <div>
              <img
                alt="not found"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
              />
              <br />
              <button
                onClick={() => {setSelectedImage(null); setImageUploadedText('Please upload a new image')}}>Remove</button>
            </div>
          )}
          <br />
            <input
            className="block w-full text-sm text-cyan-200
              file:mr-4 file:py-2 file:px-4 file:rounded-md
              file:border-0 file:text-sm file:font-semibold
              file:bg-gray-500 file:text-lime-300
              hover:file:bg-green-100"
            type="file"
            name="myImage"
            onChange={onImageUpload}
            />

            {/* <input
              type="text"
              name="Api Key"
              style={{ color: 'black', padding: '0.2lh'}}
            /> */}

          <div className="pt-8 text-base font-semibold leading-7">
            <p className="text-red-400">Ready?</p>
            <p>
              <button onClick={runOpenAIGen} className="text-orange-500 hover:text-sky-600">Take me to the vibes! &rarr;</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
