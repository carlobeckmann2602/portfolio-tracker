import React from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiArrowDown,
  FiArrowRight,
  FiArrowUp,
} from "react-icons/fi";

export type TrendIconProps = {
  trend: number;
};

export const TrendIcon = ({ trend }: TrendIconProps) => {
  // until trend is delivered by backend
  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const getTrendArrow = () => {
    const trend = randomIntFromInterval(-0.25, 0.25);
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
    <div className="w-12 h-12 p-2 bg-front text-back rounded-full flex items-center justify-center">
      {getTrendArrow()}
    </div>
  );
};
