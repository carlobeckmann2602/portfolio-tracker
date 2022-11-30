import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

/** Fetch the user's stock holdings from REST API. */
async function fetchStockHoldings(): Promise<StockHolding[]> {
  const res = await fetch(`${BACKEND_REST_URL}/users/0/stocks`);
  const dtos: StockHoldingDTO[] = (await res.json()).stocks;
  return dtos.map((dto) => createStockHoldingFromDTO(dto));
}

/** Search stocks by name in REST API. */
async function fetchStockSearch(searchTerm: string): Promise<Stock[]> {
  if (!searchTerm) return [];
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const dtos: StockDTO[] = await res.json();
  return dtos.map((dto) => createStockFromDTO(dto));
}

const STOCK_HOLDINGS_KEY = "stock-holdings";

/** Gets user's stock holdings from local storage. */
function getLocalStockHoldings(): StockHolding[] {
  const value = localStorage.getItem(STOCK_HOLDINGS_KEY);
  return value ? JSON.parse(value) : [];
}

/** Takes a stock holding and persists it in local storage. */
async function updateLocalHolding(holding: StockHolding) {
  let holdings = getLocalStockHoldings().filter(
    (other) => other.stock.id != holding.stock.id
  );

  if (holding.amount) holdings.push(holding);

  holdings = holdings.sort((a, b) => b.value - a.value);

  localStorage.setItem(STOCK_HOLDINGS_KEY, JSON.stringify(holdings));
}

export function useStockHoldings() {
  return useQuery([STOCK_HOLDINGS_KEY], getLocalStockHoldings);
}

export function useStockSearch(searchTerm: string) {
  return useQuery(["stock-search", searchTerm], ({ queryKey }) =>
    fetchStockSearch(queryKey[1])
  );
}

export function useStockHoldingMutation() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: updateLocalHolding,
    onSuccess() {
      client.invalidateQueries([STOCK_HOLDINGS_KEY]);
    },
  });
}
