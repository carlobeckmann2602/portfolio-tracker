import React from "react";
import {
  PieChart as PieChartBase,
  pieChartDefaultProps,
} from "react-minimal-pie-chart";
import { StockHolding } from "../../lib/backend";

export type PieChartProps = {
  items: StockHolding[];
  selected?: number;
  onClick?: (id: number) => void;
};

type PieChartItem = {
  value: number;
  color: string;
};

const colors = ["#4666A2", "#547ECD", "#90AFE5", "#ACBEDE", "#C5D5EE"];
const selectedSegmentOffset = 5;

export const PieChart = ({ items, selected, onClick }: PieChartProps) => {
  const pieChartItems = React.useMemo<PieChartItem[]>(
    () =>
      items.length
        ? items.map((item, i) => ({
            value: item.value,
            color: colors[i % colors.length],
          }))
        : [
            {
              value: 1,
              color: "#efefef",
            },
          ],
    [items]
  );

  const isEmpty = !items.length;

  return (
    <div className="relative pt-full text-base">
      <div className="absolute inset-0">
        <PieChartBase
          startAngle={-90}
          animate
          lineWidth={35}
          radius={pieChartDefaultProps.radius - selectedSegmentOffset}
          data={pieChartItems}
          segmentsShift={
            pieChartItems.length > 1
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
