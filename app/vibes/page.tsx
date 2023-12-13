'use client'
import React from 'react';
import { useState } from 'react';


export default function Vibes() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const onImageUpload = (e: any) => {
    console.log(e.target.files[0])
    setSelectedImage(e.target.files[0])


    //Needs to check for 
  }
  return (
    <div>
      <h1>Get Started By Uploading Your Image!</h1>

      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />
      
      <input
        type="file"
        name="myImage"
        onChange={onImageUpload}
      />
    </div>
  );

}
