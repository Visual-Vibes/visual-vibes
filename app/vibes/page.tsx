'use client'
import React from 'react';
import { useState } from 'react';
import ImageUploader from "@/components/ImageUploader";
import ImageDisplay from '@/components/ImageDisplay';
import FieldInput from '@/components/FieldInput';

  export default function Vibes() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [statusText, setStatusText] = useState('Get started by uploading your image!');
  const [makePublic, setMakePublic] = useState(true);


  const checkImageRequirements = (image: any) => {
    // TODO: Implement image req check
    return true;
  }

  const onImageUpload = (e: any) => {
    // console.log(e.target.files[0])
    if (checkImageRequirements(e.target.files[0]) == true) {
      setSelectedImage(e.target.files[0])
      setStatusText('Image Upload Success!')
    }
  }

  async function runOpenAIGen(e: any) {
    e.preventDefault();
    if (!selectedImage) {
      setStatusText('Please upload an image before submitting.');
      return;
    }
    if (!apiKey) {
      setStatusText('Please add your API Key before submitting.');
      return;
    }

    // Create a FormData object and append the image file to it
    const formData = new FormData();
    formData.append('starterImage', selectedImage);
    formData.append('apiKey', apiKey);
    formData.append('makePublic', makePublic.toString());
    // Send data to the '/api/generate' route
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      // Handle the response as needed
      console.log('Server response:', response);
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
      <div className="relative bg-zinc-800 px-6 pt-2 pb-8 shadow-xl ring-1 ring-gray-400/10 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="space-y-6 py-8 text-base leading-7 text-white">
          <h2 className="text-yellow-400">{statusText}</h2>
          <ImageDisplay image={selectedImage} onRemove={() => { setSelectedImage(null); setStatusText('Please upload a new image') }} />
          <br />

          {/* Image Input */}
          <ImageUploader onChange={onImageUpload} />

          {/* API Key Input */}
          <FieldInput onChange={(e: any) => {setApiKey(e.target.value)}}/>

          {/* Make Public Button */}
          <p> <input type="checkbox" id="makePublic" name="Make Public"
                    defaultChecked={true} onChange={(e) => {setMakePublic(e.target.checked)}}/>
          <label htmlFor="makePublic"> Make this submission public!</label></p>

          {/* Submission Button */}
          <div className="pt-8 text-base font-semibold leading-7">
            <p className="text-red-400">Ready?</p>
            <p> <button onClick={runOpenAIGen} className="text-orange-500 hover:text-sky-600">Take me to the vibes! &rarr;</button> </p>
          </div>
        </div>
      </div>
    </div>
  );
}
