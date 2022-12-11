import { useMemo } from "react";

/**
 * Generates colors for the segments of a donut chart,
 * making sure that the first and the last segment will
 * never have the same color.
 */
export function useDonutChartSegmentColors(
  colorScheme: string[],
  segmentCount: number
) {
  return useMemo(() => {
    let getColorId = (id: number) => id % colorScheme.length;

    if (segmentCount > colorScheme.length) {
      const excessItemCount = segmentCount % colorScheme.length;
      if (excessItemCount) {
        const excessIdOffset = Math.floor(excessItemCount / 2);
        const excessStartId =
          colorScheme.length * Math.floor(segmentCount / colorScheme.length);
        const midColorId = Math.floor(colorScheme.length / 2);

        const getColorIdBase = getColorId;
        getColorId = (id: number) =>
          id < excessStartId
            ? getColorIdBase(id)
            : midColorId - excessIdOffset - excessStartId + id;
      }
    }

    return new Array(segmentCount)
      .fill(undefined)
      .map((_, i) => colorScheme[getColorId(i)]);
  }, [segmentCount, colorScheme]);
}
