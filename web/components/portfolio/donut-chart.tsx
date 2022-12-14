import { PieChart } from "react-minimal-pie-chart";

export type DonutChartSegment = {
  value: number;
  color: string;
};

export type DonutChartProps = {
  segments: DonutChartSegment[];
  onClick?: (id: number) => void;
  disabled?: boolean;
};

export const DonutChart = ({
  segments,
  onClick,
  disabled,
}: DonutChartProps) => (
  <div className="relative pt-full text-base">
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
      />
    </div>
  </div>
);
