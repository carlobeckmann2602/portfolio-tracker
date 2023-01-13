import { useEffect, useMemo, useRef, useState } from "react";
import cn from "classnames";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Stock, usePortfolioData, useStockSearch } from "../../lib/backend";
import { SearchItem } from "./search-item";
import BounceLoader from "react-spinners/BounceLoader";
import { AddStockForm } from "./add-stock-form";

type StockSearchResult = { stock: Stock; inPortfolio: boolean };

export type SearchProps = {
  selectedStock: Stock | null;
  setSelectedStock: (stock: Stock) => void;
  closeSearch: () => void;
};

export const Search = ({
  selectedStock,
  setSelectedStock,
  closeSearch,
}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: portfolio, isFetching: portfolioIsFetching } =
    usePortfolioData();
  const { data: foundStocks, isFetching: searchIsFetching } =
    useStockSearch(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFetching = searchIsFetching || portfolioIsFetching;

  useEffect(() => {
    const input = inputRef.current!;

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
          portfolio?.holdings.some((holding) => holding.stock.id == stock.id) ||
          false,
      })) || [],
    [foundStocks, portfolio]
  );

  const resetSearch = () => {
    const input = inputRef.current!;
    setSearchTerm("");
    input.value = "";
    closeSearch();
  };

  const stockForm = selectedStock ? (
    <AddStockForm stock={selectedStock} onAdd={resetSearch}></AddStockForm>
  ) : null;

  return (
    <div>
      <div className={`relative ${selectedStock ? "block" : "hidden"}`}>
        {stockForm}
      </div>
      <div className={`relative ${selectedStock ? "hidden" : "block"}`}>
        <div
          className={cn(
            "absolute -top-3 right-0 pointer-events-none transition duration-500 rounded-full overflow-hidden opacity-25",
            isFetching ? "scale-100" : "scale-0"
          )}
        >
          <BounceLoader color="white" size="3rem" />
        </div>
        <h2 className="text-2xl xs:text-3xl font-bold font-serif mt-8 mb-6">
          Add stocks
        </h2>
        <div className="flex mt-4 mb-6 rounded-md bg-front/10">
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
        <div className="relative" style={{ minHeight: "8rem" }}>
          {!searchTerm || searchIsFetching || results.length ? (
            results.map(({ stock, inPortfolio }, i) => {
              const disabled = portfolioIsFetching || inPortfolio;

              return (
                <button
                  key={i}
                  className={cn(
                    "flex justify-between w-full mb-4 transition",
                    inPortfolio && !searchTerm
                      ? "hidden"
                      : disabled
                      ? "opacity-25"
                      : "rounded-md hover:bg-white/10"
                  )}
                  onClick={
                    !inPortfolio ? () => setSelectedStock(stock) : undefined
                  }
                  disabled={disabled}
                >
                  <SearchItem
                    trend={stock.trend}
                    name={stock.name}
                    price={stock.price}
                  />
                </button>
              );
            })
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
    </div>
  );
};
