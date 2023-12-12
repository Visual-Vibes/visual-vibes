'use client'
import React from 'react';
import { useState } from 'react';
import Form from '../../components/ui/Form';


export default function Vibes() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const onImageUpload = (e) => {
    console.log(e.target.files[0])
    setSelectedImage(e.target.files[0])
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
