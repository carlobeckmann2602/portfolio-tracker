import { LabelRenderFunction } from "react-minimal-pie-chart/types/commonTypes";
import { DonutChartSegment } from ".";
import { useDonutChartContext } from "./context";

export const DonutChartLabel: LabelRenderFunction<DonutChartSegment> = ({
  dataEntry,
  dataIndex,
  x,
  y,
  dx,
  dy,
  textAnchor,
}) => {
  const { selectedId, rotationAngle } = useDonutChartContext();

  return (
    <g
      transform={`translate(${x + dx}, ${y + dy})`}
      style={{ transformOrigin: "center" }}
    >
      <text
        dominantBaseline="central"
        transform={`rotate(${rotationAngle})`}
        textAnchor={textAnchor}
        style={{
          pointerEvents: "none",
          transition: "0.5s ease all",
          fontSize: "0.2rem",
          opacity: dataIndex == selectedId ? 1 : 0.5,
        }}
      >
        {dataEntry.label}
      </text>
    </g>
  );
};
