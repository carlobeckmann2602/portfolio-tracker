import React, { useEffect, useState } from "react";
import { StockData, useStocks } from "../../lib/backend";
import { Input } from "../form/input";
import { FiArrowDownRight } from "react-icons/fi";

export type SearchProps = {};

export const Search = ({}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: filteredStocks } = useStocks(searchTerm);
  const searchDelay = 500;

  let filteredStocksList = filteredStocks
    ? filteredStocks.map((stock: StockData, index: number) => {
        return (
          <div
            key={index}
            className="flex items-center mb-2 justify-between px-4 py-2 border-2 border-solida bg-main-300 rounded-sm"
          >
            <div className="flex items-center">
              <div className="mr-4 w-8 h-8 p-2 bg-main-500 text-white rounded-full flex items-center justify-center">
                <FiArrowDownRight />
              </div>
              <div>
                <p>{stock.name}</p>
                <p>+2.6%</p>
              </div>
            </div>
            <div>15 €</div>
          </div>
        );
      })
    : null;

  const handleSearchChange = (evt: Event) => {
    handleSearchInput((evt.target as HTMLTextAreaElement).value);
  };

  const handleSearchInput = (input: string) => {
    const delay = setTimeout(async () => {
      setSearchTerm(input);
    }, searchDelay);
    return () => clearTimeout(delay);
  };

  return (
    <>
      <Input
        handleChange={(evt: Event) => handleSearchChange(evt)}
        name="searchTerm"
        placeholder="Search for a stock"
      />
      {filteredStocksList}
    </>
  );
};
