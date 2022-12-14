import { PieChart } from "react-minimal-pie-chart";
import { useRotationAngle } from "./rotation";

export type DonutChartSegment = {
  value: number;
  color: string;
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

  return (
    <div className="relative pt-full text-base select-none">
      {!disabled && !!segments.length && (
        <div
          className="pointer-events-none w-1 h-6 absolute top-full left-1/2 -ml-0.5 -mt-0.5 transition duration-500"
          style={{
            backgroundColor: segments[selectedId].color,
            height: "calc(1.5rem + 2px)",
          }}
        />
      )}
      <div
        className="absolute inset-0 transition duration-500"
        style={{ transform: `rotate(${-angle}deg)` }}
      >
        <PieChart
          startAngle={90}
          animate
          lineWidth={50}
          data={segments}
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
  );
};
