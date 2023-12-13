import React from 'react'

export default function ImageDisplay(props: any) {
  return (
    <div>
        {(props.image) && (
            <div>
                <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(props.image)}
                />
                <br />
                <button
                    onClick={() => {props.onRemove(null)}}>Remove</button>
            </div>       
        )}
    </div>
  )
}
