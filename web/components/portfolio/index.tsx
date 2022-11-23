import React from "react";
import { useStockHoldings } from "../../lib/backend";
import { PieChart } from "./pie-chart";

const Portfolio = () => {
  const { data: items } = useStockHoldings();
  const [selectedId, setSelectedId] = React.useState(0);

  if (!items) return <span>Loading...</span>;

  const selected = items[selectedId];

  return (
    <div className="flex flex-col gap-4">
      <PieChart items={items} onClick={setSelectedId} selected={selectedId} />
      <div>
        <h2 className="text-2xl mb-2">{selected.stock.name}</h2>
        <p>{selected.amount.toFixed(2)}€</p>
      </div>
    </div>
  );
};

export default Portfolio;
