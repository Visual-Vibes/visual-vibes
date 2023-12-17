import React from 'react'

export default function ImageDisplay(props: any) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl space-y-2">
        {(props.image) && (
            <div className="flex flex-center">
                <img
                    alt="not found"
                    className="w-64 h-48 object-contain pt-2"
                    src={URL.createObjectURL(props.image)}
                />
                <br />
                <button className="text-gray-300 hover:text-purple-500 bg-transparent border border-purple-500 px-2 py-1 rounded"
                    onClick={() => {props.onRemove(null)}}>X   Change Image</button>
            </div>       
        )}
    </div>
  )
}
