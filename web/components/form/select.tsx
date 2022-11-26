import React from "react";
import { InputLabel } from "./input_label";

export type SelectProps = {
  name: string;
  label: string;
  options: string[];
  nullable: boolean;
};

export const Select = ({ name, label, options, nullable }: SelectProps) => {
  let emptyOptionElement = null;

  if (nullable) {
    emptyOptionElement = <option key="0"></option>;
  }
  let optionElements = options.map((option, index) => {
    return <option key={index + 1}>{option}</option>;
  });

  return (
    <div className="relative text-base form-group my-2">
      <label className="flex flex-col">
        <InputLabel>{label}</InputLabel>
        <select
          name={name}
          placeholder={label}
          className="border outline-none border-solid border-main-400/50 focus:border-main-400 p-1 rounded-sm"
        >
          {emptyOptionElement}
          {optionElements}
        </select>
      </label>
    </div>
  );
};
