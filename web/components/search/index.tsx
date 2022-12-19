import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  createStockHolding,
  Stock,
  useStockHoldingMutation,
  useStockHoldings,
  useStockSearch,
} from "../../lib/backend";
import { SearchItem } from "./search_item";

type StockSearchResult = { stock: Stock; inPortfolio: boolean };

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: holdings } = useStockHoldings();
  const { data: foundStocks } = useStockSearch(searchTerm);
  const holdingMut = useStockHoldingMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current!;

    input.focus();

    let dampTimeout: NodeJS.Timeout | null = null;

    const handleChange = () => {
      const updateFn = () => setSearchTerm(input.value);
      if (dampTimeout) {
        clearTimeout(dampTimeout);
        dampTimeout = null;
      }
      if (input.value) dampTimeout = setTimeout(updateFn, 250);
      else updateFn();
    };

    input.addEventListener("input", handleChange);
    return () => input.removeEventListener("input", handleChange);
  }, []);

  const results = useMemo<StockSearchResult[]>(
    () =>
      foundStocks?.map((stock) => ({
        stock,
        inPortfolio:
          holdings?.some((holding) => holding.stock.id == stock.id) || false,
      })) || [],
    [foundStocks, holdings]
  );

  return (
    <div>
      <h2 className="text-3xl font-bold font-serif  mt-8">Add stocks</h2>
      <div className="relative my-6 flex items-center justify-end rounded-md py-4 bg-white/10">
        <input
          ref={inputRef}
          type="text"
          name="searchTerm"
          placeholder="Search for a stock"
          className="absolute w-full outline-none bg-transparent p-4"
        />
        <FiSearch className="top-0 right-0 mr-4 text-2xl" />
      </div>
      <div style={{ minHeight: "8rem" }}>
        {results.map(({ stock, inPortfolio }, i) => (
          <button
            key={i}
            className={`flex justify-between w-full mb-4 ${
              inPortfolio && !searchTerm
                ? "hidden"
                : inPortfolio
                ? "opacity-25"
                : "rounded-md hover:bg-white/10"
            }`}
            onClick={
              !inPortfolio
                ? () => holdingMut.mutate(createStockHolding(stock))
                : undefined
            }
            disabled={inPortfolio}
          >
            <SearchItem trend={2.5} name={stock.name} price={stock.price} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Search;
