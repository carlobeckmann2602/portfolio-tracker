import { useEffect, useMemo, useRef, useState } from "react";
import {
  Stock,
  stringifyCurrencyValue,
  useStockHoldingAmountMut,
  usePortfolioData,
  useStockSearch,
} from "../lib/backend";
import { Input } from "./form/input";

type StockSearchResult = { stock: Stock; inPortfolio: boolean };

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: portfolio } = usePortfolioData();
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
    <div className="h-full flex flex-col gap-4">
      <Input name="searchTerm" label="Search for a stock" innerRef={inputRef} />
      <div className="relative h-full">
        <div className="absolute inset-0 overflow-auto">
          {results.map(({ stock, inPortfolio }, i) => (
            <button
              key={i}
              className={`flex justify-between w-full px-4 py-2 ${
                inPortfolio ? "opacity-25" : "rounded-md hover:bg-gray-100"
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
              <span className="block">
                {stock.name}{" "}
                <span className="text-gray-400">({stock.symbol})</span>
              </span>
              <span className="block">
                {stringifyCurrencyValue(stock.price)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
