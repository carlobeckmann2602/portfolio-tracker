import React from "react";
import { Modal } from "../modal";
import { PieChart } from "./pie-chart";
import { useStockHoldings } from "../../lib/backend";
import { Search } from "../stocks/search";

const Portfolio = () => {
  const { data: items } = useStockHoldings();
  const [selectedId, setSelectedId] = React.useState(0);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  if (!items) return <span>Loading...</span>;

  const selected = items[selectedId];

  return (
    <div className="relative flex flex-col gap-4">
      <Search></Search>
      <div className="z-0">
        <div
          onClick={() => setModalIsOpen(true)}
          className="absolute right-0 z-10 rounded-full border-2 border-black border-solid w-8 h-8 items-center text-center cursor-pointer"
        >
          +
        </div>
        <PieChart items={items} onClick={setSelectedId} selected={selectedId} />
        <div>
          <h2 className="text-2xl mb-2">{selected.stock.name}</h2>
          <p>{selected.amount.toFixed(2)}€</p>
        </div>
      </div>
      <Modal
        title="Add stocks"
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        <Search />
      </Modal>
    </div>
  );
};

export default Portfolio;
