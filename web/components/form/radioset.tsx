import React, { useState } from "react";
import { InputLabel } from "./input_label";

export type RadioSetProps = {
  name: string;
  label: string;
  options: string[];
};

export const RadioSet = ({ name, label, options }: RadioSetProps) => {
  const [active, setActive] = useState(0);

  let optionElements = options.map((option, index) => {
    return (
      <div key={index}>
        <label
          htmlFor={`${index}_${name}`}
          onClick={() => setActive(index)}
          className="cursor-pointer flex items-center mr-2"
        >
          <div
            className={`mr-2 rounded-full w-4 h-4 border-2 border-solid border-white outline ${
              active === index
                ? "bg-main-400 outline-main-400"
                : "outline-main-400/50 hover:outline-main-400"
            }`}
          ></div>
          <input
            className="hidden"
            type="radio"
            id={`${index}_${name}`}
            name={name}
            value={option}
          ></input>
          <div>{option}</div>
        </label>
      </div>
    );
  });

  return (
    <div className="relative text-base form-group my-2 flex flex-col">
      <InputLabel>{label}</InputLabel>
      <fieldset className="flex flex-row">{optionElements}</fieldset>
    </div>
  );
};
