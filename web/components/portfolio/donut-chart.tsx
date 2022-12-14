import React from "react";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";

export type DonutChartSegment = {
  value: number;
  color: string;
};

export type DonutChartProps = {
  segments: DonutChartSegment[];
  selected?: number;
  onClick?: (id: number) => void;
  disabled?: boolean;
};

const selectedSegmentOffset = 5;

export const DonutChart = ({
  segments,
  selected,
  onClick,
  disabled,
}: DonutChartProps) => {
  return (
    <div>
      <div className="relative pt-full text-base">
        <div className="absolute inset-0">
          <PieChart
            startAngle={-90}
            animate
            lineWidth={50}
            radius={pieChartDefaultProps.radius - selectedSegmentOffset}
            data={segments}
            segmentsShift={
              !disabled && segments.length > 1
                ? (i) => (i === selected ? selectedSegmentOffset : 0)
                : undefined
            }
            segmentsStyle={
              !disabled
                ? {
                    cursor: "pointer",
                  }
                : undefined
            }
            onClick={onClick && ((_, i) => onClick(i))}
          />
        </div>
      </div>
    </div>
  );
};
