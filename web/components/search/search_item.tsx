import React from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
} from "react-icons/fi";
import { TrendIcon } from "../stock/trend_icon";

export type SearchItemProps = {
  trend: number;
  name: string;
  price: number;
};

export const SearchItem = ({ trend, name, price }: SearchItemProps) => {
  const formatedStockValue = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-white/10 rounded-md">
      <div className="flex items-center">
        <TrendIcon trend={trend} />
        <div className="ml-4 text-left">
          <p>{name}</p>
          <p className="font-light">
            {trend > 0 ? "+" : "-"} {trend}%
          </p>
        </div>
      </div>
      <div className="font-light">{formatedStockValue}</div>
    </div>
  );
};
