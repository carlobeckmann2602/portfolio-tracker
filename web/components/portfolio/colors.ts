import { useMemo } from "react";

/**
 * Generates colors for a list of items with length
 * `itemCount`, making sure that the colors in the
 * provided `colorScheme` will evenly be applied and
 * the first item and last item will never have the
 * same color.
 */
export function useColorDistribution(itemCount: number, colorScheme: string[]) {
  return useMemo(() => {
    let getColorId = (id: number) => id % colorScheme.length;

    if (itemCount > colorScheme.length) {
      const excessItemCount = itemCount % colorScheme.length;
      if (excessItemCount) {
        const excessIdOffset = Math.floor(excessItemCount / 2);
        const excessStartId =
          colorScheme.length * Math.floor(itemCount / colorScheme.length);
        const midColorId = Math.floor(colorScheme.length / 2);

        const getColorIdBase = getColorId;
        getColorId = (id: number) =>
          id < excessStartId
            ? getColorIdBase(id)
            : midColorId - excessIdOffset - excessStartId + id;
      }
    }

    return new Array(itemCount)
      .fill(undefined)
      .map((_, i) => colorScheme[getColorId(i)]);
  }, [itemCount, colorScheme]);
}
