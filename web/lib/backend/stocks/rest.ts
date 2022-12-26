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

type StockHoldingDTO = {
  id: number;
  symbol: string;
  name: string;
  description: string;
  totalValue: number;
  totalAmount: number;
};

export type PortfolioDataDTO = {
  portfoliovalue: number;
  stocksOnUser: StockHoldingDTO[];
};

const cleanupFloat = (num: number) => Math.round((num + 0.001) * 100) / 100;

function createStockFromDTO({ histories, ...core }: StockDTO): Stock {
  return {
    ...core,
    price: histories[0].high,
    trend: histories[0].trend,
  };
}

/** Converts the REST API's data format of a stock holding to the local format. */
function createStockHoldingFromDTO({
  totalAmount,
  totalValue,
  ...core
}: StockHoldingDTO): StockHolding {
  return {
    ...core,
    amount: totalAmount,
    value: totalValue,
  };
}

function createPortfolioFromDTO(dto: PortfolioDataDTO): PortfolioData {
  return {
    value: cleanupFloat(dto.portfoliovalue),
    holdings: dto.stocksOnUser
      .filter((dto) => !!dto.totalAmount)
      .map((dto) => createStockHoldingFromDTO(dto)),
  };
}

/** Search stocks by name in REST API. */
export async function fetchStockSearch(searchTerm: string): Promise<Stock[]> {
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const dtos: StockDTO[] = await res.json();
  const filteredDtos = tempFilterStocksByName(dtos, searchTerm);
  return filteredDtos
    .filter((dto) => !!dto.histories.length)
    .map((dto) => createStockFromDTO(dto));
}

/** Fetch the user's stock holdings from REST API. */
export async function fetchPortfolioData(): Promise<PortfolioData> {
  const res = await authFetch(`${BACKEND_REST_URL}/users/me/stocks`);
  return createPortfolioFromDTO(await res.json());
}

export async function fetchStockHoldingAmountMut({
  stockId,
  amountOffset,
}: StockHoldingAmountMutVars) {
  if (!amountOffset) return;
  await authFetch(`${BACKEND_REST_URL}/users/me/stocks/${stockId}`, {
    method: amountOffset > 0 ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Math.abs(amountOffset) }),
  });
}

/* will be removed when filter is implemented in backend */
const tempFilterStocksByName = (stocks: StockDTO[], searchTerm: string) => {
  const filteredStocks: StockDTO[] = [];
  stocks.forEach((stock) => {
    if (
      stock.name.toLocaleLowerCase().startsWith(searchTerm.toLocaleLowerCase())
    ) {
      filteredStocks.push(stock);
    }
  });
  return filteredStocks;
};
