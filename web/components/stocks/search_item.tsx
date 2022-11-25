import React from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
} from "react-icons/fi";

export type SearcItemProps = {
  trend: number;
  name: string;
  value: number;
};

export const SearchItem = ({ trend, name, value }: SearcItemProps) => {
  const getTrendArrow = () => {
    if (trend > -0.5 && trend < 0.5) {
      return <FiArrowRight />;
    }
    if (trend > 0.5) {
      if (trend > 2) {
        return <FiArrowUp />;
      }
      return <FiArrowUpRight />;
    }
    if (trend < 2) {
      return <FiArrowDown />;
    }
    return <FiArrowDownRight />;
  };

  return (
    <div className="flex items-center mb-2 justify-between px-4 py-2 bg-main-300 rounded-md">
      <div className="flex items-center">
        <div className="mr-4 w-8 h-8 p-2 bg-main-500 text-white rounded-full flex items-center justify-center">
          {getTrendArrow()}
        </div>
        <div>
          <p>{name}</p>
          <p>{trend}%</p>
        </div>
      </div>
      <div>{value} €</div>
    </div>
  );
};
