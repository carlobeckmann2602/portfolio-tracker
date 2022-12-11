import React from "react";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import { StockHolding } from "../../../lib/backend";
import { useDonutChartSegmentColors } from "./colors";

export type DonutChartProps = {
  items: StockHolding[];
  selected?: number;
  onClick?: (id: number) => void;
};

type DonutChartItem = {
  value: number;
  color: string;
};

const colorScheme = ["#4666A2", "#547ECD", "#90AFE5", "#ACBEDE", "#C5D5EE"];
const selectedSegmentOffset = 5;

export const DonutChart = ({ items, selected, onClick }: DonutChartProps) => {
  const segmentColors = useDonutChartSegmentColors(colorScheme, items.length);
  const segments = React.useMemo<DonutChartItem[]>(
    () =>
      items.length
        ? items.map((item, i) => ({
            value: item.value,
            color: segmentColors[i],
          }))
        : [{ value: 1, color: "#efefef" }],
    [items, segmentColors]
  );

  const isEmpty = !items.length;

  return (
    <div className="relative pt-full text-base">
      <div className="absolute inset-0">
        <PieChart
          startAngle={-90}
          animate
          lineWidth={35}
          radius={pieChartDefaultProps.radius - selectedSegmentOffset}
          data={segments}
          segmentsShift={
            segments.length > 1
              ? (i) => (i === selected ? selectedSegmentOffset : 0)
              : undefined
          }
          segmentsStyle={
            !isEmpty
              ? {
                  cursor: "pointer",
                }
              : undefined
          }
          onClick={onClick && ((_, i) => onClick(i))}
        />
      </div>
      {isEmpty && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-1/2 text-center text-lg">
            Please add stocks to your portfolio.
          </div>
        </div>
      )}
    </div>
  );
};
