import React from "react";
import { StockHolding, useStockHoldings } from "../../lib/backend";
import { Modal } from "../modal";
import { DonutChart } from "./donut-chart";
import { StockDetails } from "./stock-details";
import Search from "../search/index";
import { FiPlus } from "react-icons/fi";

/** Manages the ID of the currently selected holding. */
function useSelectedId(
  holdings?: StockHolding[]
): [number, (value: number) => void] {
  const [id, setId] = React.useState(0);

  const cappedId = React.useMemo(
    () => (holdings?.length ? Math.min(holdings.length - 1, id) : 0),
    [id, holdings]
  );

  React.useEffect(() => {
    if (id != cappedId) setId(cappedId);
  }, [id, cappedId]);

  return [cappedId, setId];
}

/**
 * Whenever `holdings` changes: Check whether a new holding
 * has been added and if so, select it.
 */
function useHoldingAddedEffect(
  holdings: StockHolding[] | undefined,
  setSelectedId: (id: number) => void
) {
  const prevHoldingsRef = React.useRef(holdings);

  React.useEffect(() => {
    if (!holdings) return;

    const prevHoldings = prevHoldingsRef.current;
    if (prevHoldings) {
      const newHolding = holdings.find(
        (holding) =>
          !prevHoldings.find(
            (prevHolding) => holding.stock.id == prevHolding.stock.id
          )
      );

      if (newHolding) setSelectedId(holdings.indexOf(newHolding));
    }

    prevHoldingsRef.current = holdings;
  }, [holdings, setSelectedId]);
}

const Portfolio = () => {
  const { data: holdings } = useStockHoldings();
  const [selectedId, setSelectedId] = useSelectedId(holdings);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  useHoldingAddedEffect(holdings, setSelectedId);

  if (!holdings) return <span>Loading...</span>;

  return (
    <>
      <div className="relative flex flex-col gap-6 z-0">
        <div
          onClick={() => setModalIsOpen(true)}
          className="absolute right-0 z-10 rounded-full border-2 border-black border-solid w-8 h-8 flex justify-center items-center cursor-pointer"
        >
          <FiPlus />
        </div>
        <DonutChart
          items={holdings}
          onClick={setSelectedId}
          selected={selectedId}
        />
        {holdings.length > 0 && <StockDetails holding={holdings[selectedId]} />}
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
    </>
  );
};

export default Portfolio;
