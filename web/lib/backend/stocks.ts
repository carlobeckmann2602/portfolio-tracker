import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BACKEND_REST_URL } from ".";
import { authFetch, useAuthMutation, useAuthQuery } from "./auth";

type StockCoreData = {
  id: number;
  symbol: string;
  name: string;
  description: string;
};

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

type StockDTO = StockCoreData & {
  histories: StockTimeDataDTO[];
};

type StockHoldingDTO = StockCoreData & {
  totalValue: number;
  totalAmount: number;
};

export type PortfolioDataDTO = {
  portfoliovalue: number;
  stocksOnUser: StockHoldingDTO[];
};

export type Stock = StockCoreData & {
  price: number;
  trend: number;
};

export type StockHolding = StockCoreData & {
  amount: number;
  value: number;
};

export type PortfolioData = {
  holdings: StockHolding[];
  value: number;
};

const defaultPortfolioData: PortfolioData = { value: 0, holdings: [] };

const intlNum = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

/** Converts a monetary value to a localized string with currency. */
export function stringifyCurrencyValue(value: number) {
  return intlNum.format(value);
}

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
async function fetchStockSearch(searchTerm: string): Promise<Stock[]> {
  const res = await fetch(`${BACKEND_REST_URL}/stocks?name=${searchTerm}`);
  const dtos: StockDTO[] = await res.json();
  const filteredDtos = tempFilterStocksByName(dtos, searchTerm);
  return filteredDtos
    .filter((dto) => !!dto.histories.length)
    .map((dto) => createStockFromDTO(dto));
}

type StockHoldingAmountMutVars = { stockId: number; amountOffset: number };

/** Fetch the user's stock holdings from REST API. */
async function fetchPortfolioData(): Promise<PortfolioData> {
  const res = await authFetch(`${BACKEND_REST_URL}/users/me/stocks`);
  return createPortfolioFromDTO(await res.json());
}

async function fetchStockHoldingAmountMut({
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

/** Gets user's stock holdings from local storage. */
function getPortfolioFromLocalStorage(): PortfolioData {
  const value = localStorage.getItem("local-stock-portfolio");
  return value ? JSON.parse(value) : defaultPortfolioData;
}

/** Mutates the amount of a given holding in local storage. */
async function mutateHoldingAmountInLocalStorage({
  stockId,
  amountOffset,
}: StockHoldingAmountMutVars) {
  let { holdings } = getPortfolioFromLocalStorage();
  const holdingId = holdings.findIndex((other) => other.id == stockId);
  if (holdingId < 0) return;

  const [holding] = holdings.splice(holdingId, 1);
  const amount = Math.max(0, holding.amount + amountOffset);

  if (amount)
    holdings.push({
      ...holding,
      value: amount * (holding.value / holding.amount),
      amount,
    });

  holdings = holdings.sort((a, b) => a.id - b.id);

  localStorage.setItem(
    "local-stock-portfolio",
    JSON.stringify({
      value: holdings
        .map((holding) => holding.value)
        .reduce((prev, curr) => prev + curr, 0),
      holdings,
    })
  );
}

export function usePortfolioData() {
  return useAuthQuery<PortfolioData>({
    queryKey: ["stock-portfolio"],
    queryFn: fetchPortfolioData,
  });
}

export function useStockSearch(searchTerm: string) {
  return useQuery(["stock-search", searchTerm], ({ queryKey }) =>
    fetchStockSearch(queryKey[1])
  );
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

export function useStockHoldingAmountMut() {
  const client = useQueryClient();

  return useAuthMutation({
    mutationFn: (vars: StockHoldingAmountMutVars) => {
      mutateHoldingAmountInLocalStorage(vars);
      return fetchStockHoldingAmountMut(vars);
    },
    onSuccess() {
      client.invalidateQueries(["stock-portfolio"]);
    },
  });
}
