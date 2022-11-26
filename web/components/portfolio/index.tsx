import React from "react";
import { PieChart } from "./pie-chart";
import { StockDetails } from "./stock-details";

export type PortfolioItem = {
  // TODO: Replace with actual schema from backend.
  name: string;
  symbol: string;
  value: number;
  currentPrice: number;
  trend: number;
};

export type PortfolioProps = {
  items?: PortfolioItem[];
};

const mockItems: PortfolioItem[] = [
  {
    name: "Apple Inc",
    symbol: "AAPL",
    value: 800,
    currentPrice: 88.88,
    trend: +0.88,
  },
  {
    name: "Alphabet Inc",
    symbol: "GOOGL",
    value: 700,
    currentPrice: 77.77,
    trend: +0.77,
  },
  {
    name: "Amazon.com, Inc",
    symbol: "AMZN",
    value: 600,
    currentPrice: 66.66,
    trend: +0.66,
  },
  {
    name: "Meta Platforms Inc",
    symbol: "META",
    value: 500,
    currentPrice: 55.55,
    trend: +0.55,
  },
  {
    name: "Netflix Inc",
    symbol: "NFLX",
    value: 400,
    currentPrice: 44.44,
    trend: +0.44,
  },
  {
    name: "Shopify Inc",
    symbol: "SHOP",
    value: 300,
    currentPrice: 33.33,
    trend: +0.33,
  },
  {
    name: "Tesla Inc",
    symbol: "TSLA",
    value: 200,
    currentPrice: 22.22,
    trend: +0.22,
  },
  {
    name: "Volkswagen AG",
    symbol: "VWAGY",
    value: 100,
    currentPrice: 11.11,
    trend: +0.11,
  },
];

const Portfolio = ({ items }: PortfolioProps) => {
  items = items || mockItems;

  const [selectedId, setSelectedId] = React.useState(0);

  const selected = items[selectedId];

  return (
    <div className="flex flex-col gap-4">
      <PieChart items={items} onClick={setSelectedId} selected={selectedId} />
      <StockDetails stock={selected} />
    </div>
  );
};

export default Portfolio;
