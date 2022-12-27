import React from "react";
import { InputLabel } from "./input_label";
import { InputIcon } from "./input_icon";

export type InputProps = {
  type?: string;
  name: string;
  label?: string;
  placeholder?: string;
  innerRef?: React.RefObject<HTMLInputElement>;
  icon?: React.ReactNode;
};

export const Input = ({
  type = "text",
  name,
  label,
  innerRef,
  placeholder,
  icon,
}: InputProps) => {
  const labelElement = label ? <InputLabel>{label}</InputLabel> : null;
  const iconElement = icon ? <InputIcon>{icon}</InputIcon> : null;
  return (
    <div className="relative text-base form-group my-4">
      <label className="flex flex-col">
        {labelElement}
        {iconElement}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="border border-transparent outline-none border-solid focus:border-highlight1 p-3 pl-[58px] rounded-[10px] bg-[#FFFFFF1A] font-light text-lg"
          ref={innerRef}
        />
      </label>
    </div>
  );
};
