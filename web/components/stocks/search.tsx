import React, { useEffect, useState } from "react";
import { StockData, useStockHoldings } from "../../lib/backend";
import { Input } from "../form/input";

export type SearchProps = {};

export const Search = ({}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const searchDelay = 500;
  let filteredStocksList = filteredStocks.map((stock, index) => {
    return <div key={index}>{stock.name}</div>;
  });

  const handleSearchChange = (evt: Event) => {
    setSearchTerm((evt.target as HTMLTextAreaElement).value);
  };

  /* will be replaced when filter is implemented in backend */
  const tempFilterStocksByName = (stocks: StockData[], searchTerm: string) => {
    const filteredStocks: StockData[] = [];
    stocks.forEach((stock) => {
      if (
        stock.name
          .toLocaleLowerCase()
          .startsWith(searchTerm.toLocaleLowerCase())
      ) {
        filteredStocks.push(stock);
      }
    });
    return filteredStocks;
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm === "") {
        setFilteredStocks([]);
        return;
      }
      const res = await fetch(
        `https://api.mobilesys.de/stocks?name=${searchTerm}"`
      );
      const data = await res.json();
      setFilteredStocks(tempFilterStocksByName(data, searchTerm));
    }, searchDelay);
    return () => clearTimeout(delay);
  }, [searchTerm]);

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
