import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { BACKEND_REST_URL } from ".";

/** Data of a stock as received from the REST API. */
type StockDTO = {
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

/** Data of a stock holding as received from the REST API. */
type StockHoldingDTO = {
  stock: StockDTO;
  amount: number;
};

export type Stock = {
  id: number;
  symbol: string;
  name: string;
  description: string;
  price: number;
};

/** Information about the amount of shares held of a specific stock. */
export type StockHolding = {
  /** Stock of the holding. */
  stock: Stock;
  /** Number of shares held. */
  amount: number;
  /** Calculated value of all shares held. */
  value: number;
};

/** Converts a monetary value to a localized string with currency. */
export function stringifyCurrencyValue(value: number) {
  return `${value.toFixed(2)}€`;
}

export function createStockHolding(stock: Stock, amount = 1): StockHolding {
  return { stock, amount, value: amount * stock.price };
}

/**
 * Converts the REST API's data format of a stock to the local format.
 */
function createStockFromDTO(dto: StockDTO): Stock {
  const price = parseFloat(dto.high);

  return {
    id: dto.id,
    symbol: dto.symbol,
    name: dto.name,
    description: dto.description,
    price,
  };
}

/**
 * Converts the REST API's data format of a stock holding to the local format.
 */
function createStockHoldingFromDTO(dto: StockHoldingDTO): StockHolding {
  return createStockHolding(createStockFromDTO(dto.stock), dto.amount);
}

async function fetchStockHoldings(): Promise<StockHolding[]> {
  const res = await fetch(`${BACKEND_REST_URL}/users/0/stocks`);
  const dtos: StockHoldingDTO[] = (await res.json()).stocks;
  return dtos.map((dto) => createStockHoldingFromDTO(dto));
}

async function fetchStockSearch(searchTerm: string): Promise<Stock[]> {
  if (!searchTerm) return [];
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const dtos: StockDTO[] = await res.json();
  return dtos.map((dto) => createStockFromDTO(dto));
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
