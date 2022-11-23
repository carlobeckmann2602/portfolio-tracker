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

type StocksResponse = {
  stocks: StockHolding[];
};

async function fetchStocks(): Promise<StockHolding[]> {
  const res = await fetch(`${BACKEND_REST_URL}/users/0/stocks`);
  const data: StocksResponse = await res.json();
  return data.stocks;
}

export function useStockHoldings() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
  });
}
