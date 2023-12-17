'use client'
import React from 'react'

export default function ImageUploader(props: any) {
  return (
    <div>
        <input
        className="block w-full text-sm
            file:mr-4 file:py-2 file:px-4 file:rounded-md
            file:border-0 file:text-sm file:font-semibold
            file:bg-indigo-500 file:text-vgray
            hover:file:bg-indigo-600"
        type="file"
        name="uploadedImage"
        onChange={props.onChange}
        />
    </div>
  )
}
