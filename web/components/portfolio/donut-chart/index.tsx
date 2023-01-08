import { useMemo } from "react";
import { PieChart } from "react-minimal-pie-chart";
import cn from "classnames";
import { DonutChartContextProvider, DonutChartState } from "./context";
import { DonutChartLabel } from "./label";
import { useRotationAngle } from "./rotation";

export type DonutChartSegment = {
  value: number;
  color: string;
  label: string;
};

export type DonutChartProps = {
  segments: DonutChartSegment[];
  selectedId: number;
  onClick?: (id: number) => void;
  disabled?: boolean;
};

export const DonutChart = ({
  segments,
  selectedId,
  onClick,
  disabled,
}: DonutChartProps) => {
  const angle = useRotationAngle(segments, selectedId);
  const ctx = useMemo<DonutChartState>(
    () => ({ selectedId, rotationAngle: angle }),
    [selectedId, angle]
  );

  return (
    <div className="relative pt-full text-base select-none mb-6">
      {!disabled && !!segments.length && (
        <div
          className="pointer-events-none w-1 h-6 absolute top-full left-1/2 -ml-0.5 -mt-0.5 transition duration-500"
          style={{
            backgroundColor: segments[selectedId].color,
            height: "calc(1.5rem + 2px)",
          }}
        />
      )}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="h-full transition duration-500"
          style={{ transform: `rotate(${-angle}deg)` }}
        >
          <DonutChartContextProvider value={ctx}>
            <PieChart
              startAngle={90}
              animate={segments.length < 4}
              lineWidth={50}
              data={segments}
              segmentsStyle={!disabled ? { cursor: "pointer" } : undefined}
              onClick={onClick && ((_, i) => onClick(i))}
              labelPosition={75}
              label={DonutChartLabel}
            />
          </DonutChartContextProvider>
        </div>
      </div>
    </div>
  );
};
