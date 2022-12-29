import { BACKEND_REST_URL } from "..";
import { authFetch } from "../auth";
import {
  PortfolioData,
  Stock,
  StockHolding,
  StockHoldingAmountMutVars,
} from ".";

type StockTimeDataDTO = {
  id: number;
  stockId: number;
  split: number;
  open: number;
  close: number;
  high: number;
  low: number;
  trend: number;
  time: string;
};

type StockDTO = {
  id: number;
  symbol: string;
  name: string;
  description: string;
  histories: StockTimeDataDTO[];
};

type StockHoldingDTO = StockDTO & {
  amountAfterSplit: number;
  price: number;
  trend: number;
  gainAbsolute: number;
  gainPercentage: number;
};

type PortfolioDataDTO = {
  currentPortfolioValue: number;
  gainAbsolute: number;
  gainPercentage: number;
  stocks: StockHoldingDTO[];
};

type StockHoldingAmountMutVarsDTO = {
  amount: number;
  pricePerUnit: number;
  date: string;
};

const cleanupFloat = (num: number) => Math.round((num + 0.001) * 100) / 100;

function createStockFromDTO(
  dto: StockDTO,
  price?: number,
  trend?: number
): Stock {
  const timeData = dto.histories[0];

  return {
    id: dto.id,
    symbol: dto.symbol,
    name: dto.name,
    price: price || timeData?.close || 0,
    trend: trend || timeData?.trend || 0,
  };
}

function createStockHoldingFromDTO({
  amountAfterSplit,
  price,
  trend,
  ...data
}: StockHoldingDTO): StockHolding {
  return {
    stock: createStockFromDTO(data, price, trend),
    amount: amountAfterSplit,
    value: amountAfterSplit * price,
  };
}

function createPortfolioFromDTO(dto: PortfolioDataDTO): PortfolioData {
  return {
    value: cleanupFloat(dto.currentPortfolioValue),
    holdings: dto.stocks
      .filter((dto) => !!dto.amountAfterSplit)
      .map((dto) => createStockHoldingFromDTO(dto)),
  };
}

/** Fetches the user's stock holdings. */
export async function fetchPortfolioData() {
  const res = await authFetch(`${BACKEND_REST_URL}/users/me/stocks`);
  return createPortfolioFromDTO(await res.json());
}

/** Fetches public data of a specific stock. */
export async function fetchStock(stockId: number) {
  const res = await fetch(`${BACKEND_REST_URL}/stocks/${stockId}`);
  return createStockFromDTO(await res.json());
}

/** Searches stocks by name. */
export async function fetchStockSearch(searchTerm: string) {
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const dtos: StockDTO[] = await res.json();
  return dtos
    .filter((dto) => !!dto.histories.length)
    .map((dto) => createStockFromDTO(dto));
}

/** Mutates the amount of a specific stock holding. */
export async function fetchStockHoldingAmountMut({
  stockId,
  amountOffset,
  price,
  date,
}: StockHoldingAmountMutVars) {
  if (!amountOffset) return;

  const vars: StockHoldingAmountMutVarsDTO = {
    amount: Math.abs(amountOffset),
    pricePerUnit: price,
    date: date.toISOString(),
  };

  await authFetch(`${BACKEND_REST_URL}/users/me/stocks/${stockId}`, {
    method: amountOffset > 0 ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vars),
  });
}
