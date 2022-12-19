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

// until trend is delivered by backend
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const TrendArrow = (_: TrendIconProps) => {
  const trend = randomIntFromInterval(-0.25, 0.25);
  const abs = Math.abs(trend);

  if (abs > 2) {
    return trend < 0 ? <FiArrowDown /> : <FiArrowUp />;
  } else if (abs > 0.5) {
    return trend < 0 ? <FiArrowDownRight /> : <FiArrowUpRight />;
  }

  return <FiArrowRight />;
};

export const TrendIcon = ({ trend }: TrendIconProps) => (
  <div className="w-8 h-8 p-2 border border-front text-front rounded-full flex items-center justify-center">
    <TrendArrow trend={trend} />
  </div>
);
