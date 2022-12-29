import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthMutation, useAuthQuery } from "../auth";
import {
  fetchPortfolioData,
  fetchStock,
  fetchStockHoldingAmountMut,
  fetchStockSearch,
} from "./rest";

export type Stock = {
  id: number;
  symbol: string;
  name: string;
  price: number;
  trend: number;
};

export type StockHolding = {
  stock: Stock;
  amount: number;
  value: number;
};

export type PortfolioData = {
  holdings: StockHolding[];
  value: number;
};

export const usePortfolioData = () =>
  useAuthQuery({
    queryKey: ["stock-portfolio"],
    queryFn: fetchPortfolioData,
  });

const stockQueryFn = (ctx: QueryFunctionContext<[string, number]>) =>
  fetchStock(ctx.queryKey[1]);

export const useStock = (stockId: number) =>
  useQuery({ queryKey: ["stock", stockId], queryFn: stockQueryFn });

const searchQueryFn = (ctx: QueryFunctionContext<string[]>) =>
  fetchStockSearch(ctx.queryKey[1]);

export const useStockSearch = (searchTerm: string) =>
  useQuery({ queryKey: ["stock-search", searchTerm], queryFn: searchQueryFn });

export type StockHoldingAmountMutVars = {
  stockId: number;
  amountOffset: number;
  price: number;
  date: Date;
};

export function useStockHoldingAmountMut() {
  const client = useQueryClient();

  return useAuthMutation({
    mutationFn: fetchStockHoldingAmountMut,
    onSuccess() {
      client.invalidateQueries(["stock-portfolio"]);
    },
  });
}
