import React from 'react'

export default function ImageDisplay(props: any) {
  return (
    <div>
        {(props.image) && (
            <div className="flex flex-center">
                <img
                    alt="not found"
                    className="w-64 h-48 object-contain pt-2"
                    src={URL.createObjectURL(props.image)}
                />
                <br />
                <button className="text-vcinna"
                    onClick={() => {props.onRemove(null)}}>X   Change Image</button>
            </div>       
        )}
    </div>
  )
}
