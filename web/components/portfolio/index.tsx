import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { formatCurrencyValue } from "../../lib/util";
import { StockHolding, usePortfolioData } from "../../lib/backend";
import { StockDetails } from "./stock-details";
import { Search } from "../search";
import { FiPlus } from "react-icons/fi";
import { Button } from "../button";
import { DonutChart, DonutChartSegment } from "./donut-chart";
import { useColorDistribution } from "./colors";
import BounceLoader from "react-spinners/BounceLoader";

const STOCK_COLORS = ["#76FCFF", "#489CE8", "#A410FF", "#11F1A6", "#EA4FFF"];

/** Manages the ID of the currently selected holding. */
function useSelectedId(
  holdings?: StockHolding[]
): [number, (value: number) => void] {
  const [id, setId] = useState(0);

  const cappedId = useMemo(
    () => (holdings?.length ? Math.min(holdings.length - 1, id) : 0),
    [id, holdings]
  );

  useEffect(() => {
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
  const prevHoldingsRef = useRef(holdings);

  useEffect(() => {
    if (!holdings) return;

    const prevHoldings = prevHoldingsRef.current;
    if (prevHoldings) {
      const newHolding = holdings.find(
        (holding) =>
          !prevHoldings.find((prevHolding) => holding.id == prevHolding.id)
      );

      if (newHolding) setSelectedId(holdings.indexOf(newHolding));
    }

    prevHoldingsRef.current = holdings;
  }, [holdings, setSelectedId]);
}

const PortfolioContent = () => {
  const { data: portfolio, isLoading, isFetching } = usePortfolioData();
  const holdings = portfolio?.holdings;

  const [selectedId, setSelectedId] = useSelectedId(holdings);

  useHoldingAddedEffect(holdings, setSelectedId);

  const colors = useColorDistribution(holdings?.length || 0, STOCK_COLORS);

  const chartSegments = useMemo<DonutChartSegment[]>(
    () =>
      holdings?.length
        ? holdings.map((holding, i) => ({
            value: holding.value,
            label: holdings.length > 1 ? holding.symbol : "",
            color: colors[i],
          }))
        : [{ value: 1, color: "#180A44", label: "" }],
    [holdings, colors]
  );

  return (
    <div>
      <div className="relative">
        <div className="relative">
          <DonutChart
            segments={chartSegments}
            selectedId={selectedId}
            onClick={setSelectedId}
            disabled={!holdings?.length}
          />
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div
              className={cn(
                "transition-transform duration-500",
                isFetching && !isLoading ? "transform" : "scale-0"
              )}
            >
              <BounceLoader color="#180A44" />
            </div>
          </div>
        </div>
      </div>
      <div>
        {holdings?.length ? (
          <StockDetails
            holding={holdings[selectedId]}
            selectionColor={colors[selectedId]}
          />
        ) : (
          <p
            className="text-center text-2xl font-light mx-auto mb-12"
            style={{ maxWidth: "16rem" }}
          >
            {isLoading
              ? "Loading..."
              : "Tap the plus button to add a new stock."}
          </p>
        )}
        <Button href="/settings" look={1} className="mt-4">
          Personal settings
        </Button>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const { data: portfolio } = usePortfolioData();
  const [searchActive, setSearchActive] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 relative">
        <h2 className="text-xl xs:text-2xl font-light">Your balance</h2>
        <p className="font-semibold text-highlight1 text-3xl sm:text-4xl">
          {portfolio ? formatCurrencyValue(portfolio.value) : <>&nbsp;</>}
        </p>
        <div
          onClick={() => setSearchActive(!searchActive)}
          className="absolute bottom-0 right-0 z-10 rounded-full border border-highlight1 text-highlight1 
          border-solid w-10 h-10 flex justify-center items-center cursor-pointer text-[30px]"
        >
          <FiPlus
            className={`transition-transform duration-500 select-none ${
              searchActive ? "rotate-[135deg]" : null
            }`}
          />
        </div>
      </div>
      <div className="relative -mx-6 z-0 rounded-t-3xl p-6 bg-falloff-soft">
        <div className="xs:px-4 sm:px-6">
          {searchActive ? <Search /> : <PortfolioContent />}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
