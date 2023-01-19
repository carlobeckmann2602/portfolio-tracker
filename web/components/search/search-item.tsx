import React from "react";
import { formatCurrencyValue } from "../../lib/util";
import { TrendIcon } from "../stock/trend-icon";

export type SearchItemProps = {
  trend: number;
  name: string;
  price: number;
};

export const SearchItem = ({ trend, name, price }: SearchItemProps) => (
  <div className="w-full px-4 py-2 bg-front/10 rounded-md flex items-center gap-4">
    <TrendIcon trend={trend} />
    <div className="text-left flex-1">
      <p>{name}</p>
      <p className="font-light">
        {trend > 0 ? "+" : ""}
        {trend}%
      </p>
    </div>
    <div className="font-light">{formatCurrencyValue(price)}</div>
  </div>
);
