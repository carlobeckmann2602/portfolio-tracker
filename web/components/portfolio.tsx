import React from "react";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";

export type PortfolioItem = {
  symbol: string;
  value: number;
};

export type PortfolioProps = {
  items?: PortfolioItem[];
};

type PieChartItem = PortfolioItem & {
  color: string;
};

const colors = ["#4666A2", "#547ECD", "#90AFE5", "#ACBEDE", "#C5D5EE"];
const selectedSegmentOffset = 5;

const mockItemsCount = 8;
const mockItems: PieChartItem[] = new Array(mockItemsCount)
  .fill(undefined)
  .map((_, i) => ({
    symbol: "",
    value: mockItemsCount - i,
    color: colors[i % colors.length],
  }));

const Portfolio = ({ items }: PortfolioProps) => {
  const [selected, setSelected] = React.useState<number | null>(null);

  const pieChartItems = React.useMemo<PieChartItem[] | undefined>(
    () =>
      items &&
      items.map((item, i) => ({
        ...item,
        color: colors[i % colors.length],
      })),
    [items]
  );

  return (
    <div className="relative pt-full text-base">
      <div className="absolute inset-0">
        <PieChart
          startAngle={-90}
          animate
          lineWidth={35}
          radius={pieChartDefaultProps.radius - selectedSegmentOffset}
          data={pieChartItems || mockItems}
          labelStyle={(_) => ({
            fontSize: "3px",
            letterSpacing: "-0.15px",
            fontWeight: 700,
            pointerEvents: "none",
            opacity: 0.5,
          })}
          labelPosition={100 - 35 / 2}
          segmentsShift={(i) => (i === selected ? selectedSegmentOffset : 0)}
          segmentsStyle={{
            cursor: "pointer",
          }}
          onClick={(_, i) => setSelected(selected === i ? null : i)}
        />
      </div>
    </div>
  );
};

export default Portfolio;
