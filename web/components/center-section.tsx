import React from "react";

/**
 * Responsive wrapper which centers its contents horizontally
 * using sensible values for horizontal padding and max width.
 */
export function CenterSection({ children }: React.PropsWithChildren) {
  return <div className="mx-auto px-6 box-content max-w-lg">{children}</div>;
}
