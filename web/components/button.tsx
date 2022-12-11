import React from "react";

export type ButtonProps = {
  style?: string;
  type?: "button" | "submit" | "reset";
};

export const Button = ({
  style = "primary",
  type = "button",
  children,
}: React.PropsWithChildren<ButtonProps>) => {
  const primaryStyles =
    "bg-highlight1 text-back hover:bg-back hover:text-highlight1";
  const secondaryStyles =
    "bg-white text-highlight1 hover:bg-highlight1 hover:text-white";

  return (
    <button
      type={type}
      className={`relative my-2 px-3 py-1 rounded-sm text-base font-bold border-2 border-solid border-highlight1 
        ${style === "primary" ? primaryStyles : secondaryStyles}`}
    >
      {children}
    </button>
  );
};
