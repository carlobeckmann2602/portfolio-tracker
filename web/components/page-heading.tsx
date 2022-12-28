import React from "react";
import { CenterSection } from "./center-section";

/** Default heading for pages. */
export function PageHeading({
  children,
  description,
}: React.PropsWithChildren<{ description?: string }>) {
  return (
    <div className="relative pt-24 mb-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-back-offset to-back-offset/0" />
      <CenterSection>
        <h1 className="text-5xl font-bold font-serif leading-[1.15]">
          {children}
        </h1>
        {description && (
          <p className="mt-4 font-light text-xl">{description}</p>
        )}
      </CenterSection>
    </div>
  );
}
