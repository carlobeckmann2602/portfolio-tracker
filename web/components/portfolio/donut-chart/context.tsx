import { createContext, useContext } from "react";

export type DonutChartState = {
  selectedId: number;
  rotationAngle: number;
};

const DonutChartContext = createContext<DonutChartState | null>(null);

export const DonutChartContextProvider = DonutChartContext.Provider;
export const useDonutChartContext = () => useContext(DonutChartContext)!;
