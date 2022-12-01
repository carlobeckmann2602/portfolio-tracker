import React from "react";
import { InputLabel } from "./input_label";

export type TextAreaProps = {
  name: string;
  label?: string;
  placeholder?: string;
};

export const TextArea = ({ name, label, placeholder }: TextAreaProps) => {
  const labelElement = label ? <InputLabel>{label}</InputLabel> : null;

  return (
    <div className="relative text-base form-group my-2">
      <label className="flex flex-col">
        {labelElement}
        <textarea
          name={name}
          placeholder={placeholder}
          className="border outline-none border-solid border-main-400/50 focus:border-main-400 p-1 rounded-sm"
        />
      </label>
    </div>
  );
};
