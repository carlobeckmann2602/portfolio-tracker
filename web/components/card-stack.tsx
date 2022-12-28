import { ReactNode, useEffect, useRef, useState } from "react";
import cn from "classnames";

export function CardStack({
  front,
  back,
  showFront,
  transitionDuration = 750,
}: {
  front: ReactNode;
  back: ReactNode;
  showFront: boolean;
  transitionDuration?: number;
}) {
  const [prevShowFront, setPrevShowFront] = useState(showFront);
  const [inTransition, setInTransition] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (showFront == prevShowFront) return;
    setPrevShowFront(showFront);
    setInTransition(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setInTransition(false);
    }, transitionDuration);
  }, [showFront, prevShowFront, transitionDuration]);

  return (
    <div className={cn("relative", !inTransition && "overflow-hidden")}>
      <div
        style={{ transitionDuration: `${transitionDuration}ms` }}
        className={cn(
          "transition",
          prevShowFront
            ? "absolute inset-x-0 opacity-0 pointer-events-none scale-50"
            : "relative"
        )}
      >
        {back}
      </div>
      <div
        style={{ transitionDuration: `${transitionDuration}ms` }}
        className={cn(
          "transition",
          !prevShowFront
            ? "absolute inset-x-0 top-0 opacity-0 translate-y-64 pointer-events-none"
            : "relative"
        )}
      >
        {front}
      </div>
    </div>
  );
}
