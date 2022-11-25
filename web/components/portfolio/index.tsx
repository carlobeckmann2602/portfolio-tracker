import React from "react";
import { PieChart } from "./pie-chart";

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

type PieChartItem = PortfolioItem & {
  color: string;
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
      <div className="w-4/5 self-center">
        <div className="flex flex-row">
          <div className="rounded-full w-16 h-16 bg-gray-600 mr-6 mb-6">
          </div>
          <div>
            <h2 className="text-4xl mb-2 font-medium">{selected.name}</h2>
            <p className="text-2xl">{selected.value.toFixed(2)}€</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Current price:</p>
            <p className="text-2xl">{selected.currentPrice}€</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Trend:</p>
            <p className="text-2xl">{selected.trend}%</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Count:</p>
            <div className="flex flex-row items-center">
              <button className="text-2xl rounded-md border border-black w-11 h-11">-</button>
              <p className="text-2xl p-3">0</p>
              <button className="text-2xl rounded-md border border-black w-11 h-11">+</button>
            </div>
          </div>
        </div>
      </div>
      <button className="text-2xl rounded-md border border-black w-[350px] h-20">Remove all</button>
    </div>
  );
};

export default Portfolio;
