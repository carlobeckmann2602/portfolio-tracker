import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import _ from "cypress/types/lodash";
import { useAuthMutation, useAuthQuery } from "../auth";
import {
  fetchPortfolioData,
  fetchStockHoldingAmountMut,
  fetchStockSearch,
} from "./rest";

type StockCoreData = {
  id: number;
  symbol: string;
  name: string;
  description: string;
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

export function usePortfolioData() {
  return useAuthQuery<PortfolioData>({
    queryKey: ["stock-portfolio"],
    queryFn: fetchPortfolioData,
  });
}

const searchQueryFn = (ctx: QueryFunctionContext<string[]>) =>
  fetchStockSearch(ctx.queryKey[1]);

export function useStockSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["stock-search", searchTerm],
    queryFn: searchQueryFn,
  });
}

export type StockHoldingAmountMutVars = {
  stockId: number;
  amountOffset: number;
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
