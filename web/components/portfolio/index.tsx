import React from "react";
import { PieChart } from "./pie-chart";

export type PortfolioItem = {
  // TODO: Replace with actual schema from backend.
  name: string;
  symbol: string;
  value: number;
};

export type PortfolioProps = {
  items?: PortfolioItem[];
};

type PieChartItem = PortfolioItem & {
  color: string;
};

const mockItems: PortfolioItem[] = [
  {
    name: "Apple Inc",
    symbol: "AAPL",
    value: 800,
  },
  {
    name: "Alphabet Inc",
    symbol: "GOOGL",
    value: 700,
  },
  {
    name: "Amazon.com, Inc",
    symbol: "AMZN",
    value: 600,
  },
  {
    name: "Meta Platforms Inc",
    symbol: "META",
    value: 500,
  },
  {
    name: "Netflix Inc",
    symbol: "NFLX",
    value: 400,
  },
  {
    name: "Shopify Inc",
    symbol: "SHOP",
    value: 300,
  },
  {
    name: "Tesla Inc",
    symbol: "TSLA",
    value: 200,
  },
  {
    name: "Volkswagen AG",
    symbol: "VWAGY",
    value: 100,
  },
];

const Portfolio = ({ items }: PortfolioProps) => {
  items = items || mockItems;

  const [selectedId, setSelectedId] = React.useState(0);

  const selected = items[selectedId];

  return (
    <div className="flex flex-col gap-4">
      <PieChart items={items} onClick={setSelectedId} selected={selectedId} />
      <div>
        <h2 className="text-2xl mb-2">{selected.name}</h2>
        <p>{selected.value.toFixed(2)}€</p>
      </div>
    </div>
  );
};

export default Portfolio;
