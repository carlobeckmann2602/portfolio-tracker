import { useEffect, useMemo, useRef, useState } from "react";
import {
  useStockHoldingAddition,
  useStockHoldings,
  useStockSearch,
} from "../lib/backend";
import { Input } from "./form/input";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: holdings } = useStockHoldings();
  const { data: foundStocks } = useStockSearch(searchTerm);
  const addStockHolding = useStockHoldingAddition();
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

  const filteredStocks = useMemo(
    () =>
      foundStocks?.filter((stock) =>
        holdings?.every((holding) => holding.stock.id != stock.id)
      ),
    [foundStocks, holdings]
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <Input name="searchTerm" label="Search for a stock" innerRef={inputRef} />
      <div className="relative h-full">
        <div className="absolute inset-0 overflow-auto">
          {filteredStocks &&
            filteredStocks.map((stock, i) => (
              <button
                key={i}
                className="flex justify-between w-full px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => addStockHolding?.({ stock, amount: 1 })}
              >
                <span className="block">
                  {stock.name}{" "}
                  <span className="text-gray-400">({stock.symbol})</span>
                </span>
                <span className="block">{stock.high}€</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
