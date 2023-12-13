'use client'
import React from 'react'

export default function ImageUploader(props: any) {
  return (
    <div>
        <input
        className="block w-full text-sm text-cyan-200
            file:mr-4 file:py-2 file:px-4 file:rounded-md
            file:border-0 file:text-sm file:font-semibold
            file:bg-gray-500 file:text-lime-300
            hover:file:bg-green-100"
        type="file"
        name="uploadedImage"
        onChange={props.onChange}
        />
    </div>
  )
}
