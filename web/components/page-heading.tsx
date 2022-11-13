import React from "react";

/**
 * Default heading for pages.
 */
export function PageHeading({ children }: React.PropsWithChildren) {
  return (
    <h1 className="mt-6 mb-6 text-2xl font-medium sm:mt-20 sm:text-3xl">
      {children}
    </h1>
  );
}
