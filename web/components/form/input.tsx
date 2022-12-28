import React from "react";

export type InputProps = {
  type?: string;
  name: string;
  placeholder?: string;
  innerRef?: React.RefObject<HTMLInputElement>;
  icon?: React.ReactNode;
};

export const Input = ({
  type = "text",
  name,
  innerRef,
  placeholder,
  icon,
}: InputProps) => (
  <div className="relative text-base form-group">
    <label className="flex flex-col">
      {icon && (
        <div className="h-5 w-5 absolute box-border top-1/3 ml-5 pointer-events-none opacity-60">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="border border-transparent outline-none border-solid focus:border-highlight1 p-3 pl-14 rounded-[10px] bg-front/10 font-light text-lg"
        ref={innerRef}
      />
    </label>
  </div>
);
