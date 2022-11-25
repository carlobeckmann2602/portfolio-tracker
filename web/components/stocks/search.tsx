import React, { useState } from "react";
import { StockData, useStocks } from "../../lib/backend";
import { Input } from "../form/input";
import { SearchItem } from "./search_item";

export type SearchProps = {};

export const Search = ({}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: filteredStocks } = useStocks(searchTerm);
  const searchDelay = 500;

  const rand = (min: number, max: number) => {
    return parseFloat((Math.random() * (max - min + 1) + min).toFixed(2));
  };

  const oftenAddedLabel =
    searchTerm === "" ? <i className="mb-2">Often added:</i> : null;

  /* trend is a random value, replace when trend is included in the endpoint response */
  let filteredStocksList = filteredStocks
    ? filteredStocks.map((stock: StockData, index: number) => {
        return (
          <SearchItem
            key={index}
            name={stock.name}
            trend={rand(-4.0, 4.0)}
            value={stock.open}
          />
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
    <div className="flex flex-col h-full">
      <Input
        handleChange={(evt: Event) => handleSearchChange(evt)}
        name="searchTerm"
        placeholder="Search for a stock"
      />
      {oftenAddedLabel}
      <div className="overflow-scroll">{filteredStocksList}</div>
    </div>
  );
};
