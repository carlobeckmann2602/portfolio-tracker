import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
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

async function fetchStockHoldings(): Promise<StockHolding[]> {
  const res = await fetch(`${BACKEND_REST_URL}/users/0/stocks`);
  return (await res.json()).stocks;
}

async function fetchStockSearch(searchTerm: string): Promise<StockData[]> {
  if (!searchTerm) return [];
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  return await res.json();
}

const STOCK_HOLDINGS_KEY = "stock-holdings";

function getLocalStockHoldings(): StockHolding[] {
  const value = localStorage.getItem(STOCK_HOLDINGS_KEY);
  return value ? JSON.parse(value) : [];
}

function setLocalStockHoldings(holdings: StockHolding[]) {
  localStorage.setItem(STOCK_HOLDINGS_KEY, JSON.stringify(holdings));
  return Promise.resolve();
}

export function useStockHoldings() {
  return useQuery([STOCK_HOLDINGS_KEY], getLocalStockHoldings);
}

export function useStockSearch(searchTerm: string) {
  return useQuery(["stock-search", searchTerm], ({ queryKey }) =>
    fetchStockSearch(queryKey[1])
  );
}

export function useStockHoldingSetter() {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: setLocalStockHoldings,
    onSuccess() {
      client.invalidateQueries([STOCK_HOLDINGS_KEY]);
    },
  });
  return useCallback(
    (holdings: StockHolding[]) =>
      mutation.mutate(
        holdings.sort((a, b) => a.stock.symbol.localeCompare(b.stock.symbol))
      ),
    [mutation]
  );
}

export function useStockHoldingAddition() {
  const setStockHoldings = useStockHoldingSetter();
  const { data: holdings } = useStockHoldings();
  const addHolding = useCallback(
    (holding: StockHolding) => {
      if (
        !holdings ||
        holdings.find((other) => holding.stock.id == other.stock.id)
      )
        return;
      setStockHoldings([...holdings, holding]);
    },
    [holdings, setStockHoldings]
  );

  return holdings ? addHolding : null;
}

export function useStockHoldingRemoval() {
  const setStockHoldings = useStockHoldingSetter();
  const { data: holdings } = useStockHoldings();
  const removeHolding = useCallback(
    (holding: StockHolding) => {
      if (!holdings) return;
      setStockHoldings(
        holdings.filter((other) => holding.stock.id != other.stock.id)
      );
    },
    [holdings, setStockHoldings]
  );

  return holdings ? removeHolding : null;
}
