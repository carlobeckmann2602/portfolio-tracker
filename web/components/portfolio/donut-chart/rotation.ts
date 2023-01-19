import { useMemo, useRef } from "react";
import { DonutChartSegment } from ".";

export function useRotationAngle(
  segments: DonutChartSegment[],
  selectedId: number
) {
  const segmentValues = useMemo(() => {
    const total = segments
      .map((segment) => segment.value)
      .reduce((prev, curr) => prev + curr, 0);
    let x = 0;
    return segments.map((segment) => {
      x += segment.value;
      return (x - segment.value / 2) / total;
    });
  }, [segments]);

  const ref = useRef(0);

  return useMemo(() => {
    const prevValue = ref.current;
    const norm = segmentValues[selectedId];

    const value = norm + Math.floor(prevValue);

    let diff = value - prevValue;

    if (Math.abs(diff) > 0.5) {
      diff += diff < 0 ? 1 : -1;
    }

    ref.current += diff;

    return 360 * ref.current;
  }, [selectedId, segmentValues]);
}
