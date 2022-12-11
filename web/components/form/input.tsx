import React from "react";
import { InputLabel } from "./input_label";

export type InputProps = {
  type?: string;
  name: string;
  label?: string;
  placeholder?: string;
  innerRef?: React.RefObject<HTMLInputElement>;
};

export const Input = ({
  type = "text",
  name,
  label,
  innerRef,
  placeholder,
}: InputProps) => {
  const labelElement = label ? <InputLabel>{label}</InputLabel> : null;
  return (
    <div className="relative text-base form-group my-2">
      <label className="flex flex-col">
        {labelElement}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="border outline-none border-solid border-highlight1/50 focus:border-highlight1 p-1 rounded-sm bg-transparent"
          ref={innerRef}
        />
      </label>
    </div>
  );
};
