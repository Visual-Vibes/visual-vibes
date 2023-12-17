import React from "react";

export default function FieldInput(props: any) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl space-y-2 mt-5 mb-0">
      <p className="text-purple-500 font-semibold text-sm mt-2">Enter your OpenAI API Key</p>
      <input
        type="text"
        placeholder={props.placeholder}
        name="Api Key"
        className="bg-gray-700 text-gray-300 outline-none px-2 py-1 rounded border border-purple-500"
        onChange={props.onChange}
      />
    </div>
  );
}
