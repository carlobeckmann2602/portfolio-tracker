import React from "react";
import { StockHolding, useStockHoldings } from "../../lib/backend";
import { Modal } from "../modal";
import { DonutChart } from "./donut-chart";
import { StockDetails } from "./stock-details";
import Search from "../search/index";
import { FiPlus } from "react-icons/fi";

/**
 * Manages the ID of the currently selected holding.
 *
 * This hook is so annoyingly complicated because when
 * the user updates a holding, it is possible that the
 * holding changes its position in the `holdings` list.
 * When this happens we need to make sure that the
 * selection does not suddenly change from one stock
 * to another.
 */
function useSelectedId(
  holdings?: StockHolding[]
): [number, (value: number) => void] {
  const [id, setId] = React.useState(0);
  const [stockId, setStockId] = React.useState(-1);
  const holdingsRef = React.useRef(holdings);
  holdingsRef.current = holdings;

  const setIdAction = React.useCallback((newId: number) => {
    setId(newId);
    const holdings = holdingsRef.current;
    if (holdings && newId <= holdings.length - 1)
      setStockId(holdings[newId].stock.id);
  }, []);

  const cappedId = React.useMemo(
    () => (holdings?.length ? Math.min(holdings.length - 1, id) : 0),
    [id, holdings]
  );

  React.useEffect(() => {
    if (id == cappedId) return;
    setIdAction(cappedId);
  }, [id, cappedId, setIdAction]);

  React.useEffect(() => {
    if (!holdings?.length) return;
    if (stockId < 0) {
      setStockId(holdings[0].stock.id);
    } else {
      const id = holdings.findIndex((holding) => holding.stock.id == stockId);
      if (id > -1) setId(id);
    }
  }, [stockId, holdings]);

  return [cappedId, setIdAction];
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
          className="absolute right-0 z-10 rounded-full border-2 border-highlight1 text-highlight1 border-solid w-8 h-8 flex justify-center items-center cursor-pointer"
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
