import React from 'react'

export default function FieldInput(props: any) {
  return (
    <div>
        <p className="text-blue-400"> Enter your OpenAI API Key </p>
        <input
            type="text"
            name="Api Key"
            style={{ color: 'black', padding: '0.2lh'}}
            onChange={props.onChange}
        />
    </div>
  )
}
