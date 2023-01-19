import React from "react";

export type SelectProps = {
  name: string;
  placeholder: string;
  options: string[];
  nullable: boolean;
};

export const Select = ({
  name,
  placeholder,
  options,
  nullable,
}: SelectProps) => {
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
        <select
          name={name}
          placeholder={placeholder}
          className="border outline-none border-solid border-highlight1/50 focus:border-highlight1 p-1 rounded-sm"
        >
          {emptyOptionElement}
          {optionElements}
        </select>
      </label>
    </div>
  );
};
