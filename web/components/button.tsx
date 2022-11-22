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
    "bg-main-400 text-white hover:bg-white hover:text-main-400";
  const secondaryStyles =
    "bg-white text-main-400 hover:bg-main-400 hover:text-white";

  return (
    <button
      type={type}
      className={`relative my-2 px-3 py-1 rounded-sm text-base font-bold border-2 border-solid border-main-400 
        ${style === "primary" ? primaryStyles : secondaryStyles}`}
    >
      {children}
    </button>
  );
};
