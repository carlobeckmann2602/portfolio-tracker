import { PieChart } from "react-minimal-pie-chart";

export type DonutChartSegment = {
  value: number;
  color: string;
  label: string;
};

export type DonutChartProps = {
  segments: DonutChartSegment[];
  onClick?: (id: number) => void;
  disabled?: boolean;
  selectedId: number;
};

export const DonutChart = ({
  segments,
  onClick,
  disabled,
  selectedId,
}: DonutChartProps) => (
  <div className="relative pt-full text-base select-none">
    <div className="absolute inset-0">
      <PieChart
        startAngle={-90}
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
        label={({ dataEntry }) => dataEntry.label}
        labelPosition={75}
        labelStyle={(i) => ({
          pointerEvents: "none",
          transition: "0.2s ease opacity",
          opacity: i == selectedId ? 1 : 0.5,
          fontSize: "0.2rem",
        })}
      />
    </div>
  </div>
);
