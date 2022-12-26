import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  Stock,
  useStockHoldingAmountMut,
  usePortfolioData,
  useStockSearch,
} from "../../lib/backend";
import { SearchItem } from "./search_item";

type StockSearchResult = { stock: Stock; inPortfolio: boolean };

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: portfolio, isLoading } = usePortfolioData();
  const { data: foundStocks } = useStockSearch(searchTerm);
  const holdingAmountMut = useStockHoldingAmountMut();
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
          portfolio?.holdings.some((holding) => holding.id == stock.id) ||
          false,
      })) || [],
    [foundStocks, portfolio]
  );

  return (
    <div>
      <h2 className="text-3xl font-bold font-serif  mt-8">Add stocks</h2>
      <div className="flex my-6 rounded-md bg-front/10">
        <input
          ref={inputRef}
          type="text"
          name="searchTerm"
          placeholder="Search for a stock"
          className="w-full outline-none bg-transparent py-4 pl-4"
        />
        <button
          className="w-14 flex-shrink-0 text-2xl flex justify-center items-center"
          onClick={() => {
            const input = inputRef.current!;
            if (searchTerm) {
              setSearchTerm("");
              input.value = "";
            }
            input.focus();
          }}
        >
          <div className="pointer-events-none">
            {searchTerm.length ? (
              <FiPlus className="rotate-45" />
            ) : (
              <FiSearch />
            )}
          </div>
        </button>
      </div>
      <div style={{ minHeight: "8rem" }}>
        {!searchTerm || isLoading || results.length ? (
          results.map(({ stock, inPortfolio }, i) => (
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
                  ? () =>
                      holdingAmountMut.mutate({
                        stockId: stock.id,
                        amountOffset: 1,
                      })
                  : undefined
              }
              disabled={inPortfolio}
            >
              <SearchItem trend={2.5} name={stock.name} price={stock.price} />
            </button>
          ))
        ) : (
          <p
            className="font-light text-center mx-auto"
            style={{ maxWidth: "10rem" }}
          >
            No stocks found with name &quot;
            {searchTerm.length < 12
              ? searchTerm
              : `${searchTerm.substring(0, 9)}...`}
            &quot;.
          </p>
        )}
      </div>
    </div>
  );
};
