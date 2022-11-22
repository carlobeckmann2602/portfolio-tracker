import React from "react";
import { InputLabel } from "./input_label";

export type TextAreaProps = {
  name: string;
  label: string;
};

export const TextArea = ({ name, label }: TextAreaProps) => {
  return (
    <div className="relative text-base form-group my-2">
      <label className="flex flex-col">
        <InputLabel>{label}</InputLabel>
        <textarea
          name={name}
          placeholder={label}
          className="border outline-none border-solid border-main-400/50 focus:border-main-400 p-1 rounded-sm"
        />
      </label>
    </div>
  );
};
