import { useQuery } from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";

export type StockData = {
  id: number;
  symbol: string;
  name: string;
  open: string;
  close: string;
  high: string;
  low: string;
  description: string;
  time: string;
};

export type StockHolding = {
  stock: StockData;
  amount: number;
};

type StockHoldingsResponse = {
  stocks: StockHolding[];
};

type StocksResponse = {
  stocks: StockData[];
};


async function fetchStockByUser(): Promise<StockHolding[]> {
  const res = await fetch(`${BACKEND_REST_URL}/users/0/stocks`);
  const data: StockHoldingsResponse = await res.json();
  return data.stocks;
}

async function fetchStocks(searchTerm: string): Promise<StockData[]> {
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const data: StockData[] = await res.json();
  return tempFilterStocksByName(data, searchTerm);
}

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

export function useStockHoldings() {
  return useQuery({
    queryKey: ["stock_holdings"],
    queryFn: fetchStockByUser,
  });
}

export function useStocks(searchTerm: string) {
  return useQuery({
    queryKey: ["stocks", searchTerm],
    queryFn: () => fetchStocks(searchTerm),
  });
}