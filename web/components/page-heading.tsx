import React from "react";

/**
 * Default heading for pages.
 */
export function PageHeading({ children }: React.PropsWithChildren) {
  return (
    <h1 className="my-6 text-2xl font-bold font-serif sm:mt-20 sm:text-3xl">
      {children}
    </h1>
  );
}
