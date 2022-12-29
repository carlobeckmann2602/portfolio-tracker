import React from "react";

export type TextAreaProps = {
  name: string;
  placeholder?: string;
};

export const TextArea = ({ name, placeholder }: TextAreaProps) => (
  <div className="relative text-base form-group my-2">
    <label className="flex flex-col">
      <textarea
        name={name}
        placeholder={placeholder}
        className="border outline-none border-solid border-highlight1/50 focus:border-highlight1 p-1 rounded-sm"
      />
    </label>
  </div>
);
