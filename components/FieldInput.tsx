import React from "react";

export default function FieldInput(props: any) {
  return (
    <div>
      <p className="text-vgray font-semibold mt-7"> Enter your OpenAI API Key </p>
      <input
        type="text"
        placeholder={props.placeholder}
        name="Api Key"
        className="outline-2 px-2 outline outline-gray-400"
        onChange={props.onChange}
      />
    </div>
  );
}
