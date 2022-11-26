import React from "react";
import { InputLabel } from "./input_label";

export type InputProps = {
  type?: string;
  name: string;
  label: string;
};

export const Input = ({ type = "text", name, label }: InputProps) => {
  return (
    <div className="relative text-base form-group my-2">
      <label className="flex flex-col">
        <InputLabel>{label}</InputLabel>
        <input
          type={type}
          name={name}
          placeholder={label}
          className="border outline-none border-solid border-main-400/50 focus:border-main-400 p-1 rounded-sm"
        />
      </label>
    </div>
  );
};
