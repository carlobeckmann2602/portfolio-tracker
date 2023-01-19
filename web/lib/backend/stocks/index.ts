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
  pricePerShare: number;
  date: Date;
  stock: Stock;
};

export function useStockHoldingAmountMut() {
  const client = useQueryClient();

  return useAuthMutation({
    mutationFn: fetchStockHoldingAmountMut,
    async onMutate(variables) {
      await client.cancelQueries(["stock-portfolio"]);

      const previousValue = client.getQueryData<PortfolioData>([
        "stock-portfolio",
      ]);

      client.setQueryData<PortfolioData>(
        ["stock-portfolio"],
        (old) => {
          // If there is no data, no need to do anything
          if (!old) return;

          let newHoldings;
          const ammountAfterOffset = old.holdings.find((holding) =>
            holding.stock.id === variables.stockId
          )?.amount! + variables.amountOffset;

          // If the amount after the offset is 0 or less, remove the holding
          if (ammountAfterOffset > 0 || variables.amountOffset > 0) {
            // If the holding already exists, update it, otherwise add it
            if (
              old.holdings.some((holding) =>
                holding.stock.id === variables.stockId
              )
            ) {
              newHoldings = old.holdings.map((holding) => {
                if (holding.stock.id === variables.stockId) {
                  return {
                    ...holding,
                    stock: variables.stock,
                    amount: holding.amount + variables.amountOffset,
                    value: holding.value +
                      variables.amountOffset * variables.pricePerShare,
                  };
                }
                return holding;
              });
            } else {
              newHoldings = [
                ...old.holdings,
                {
                  stock: variables.stock,
                  amount: variables.amountOffset,
                  value: variables.amountOffset * variables.pricePerShare,
                },
              ];
            }
          } else {
            // If the amount after the offset is 0 or less, remove the holding
            newHoldings = old.holdings.filter((holding) => {
              return holding.stock.id !== variables.stockId;
            });
          }

          // Sort the holdings by stock id
          return {
            value: old.value + variables.amountOffset * variables.pricePerShare,
            holdings: newHoldings.sort((a, b) =>
              a.stock.id - b.stock.id
            ),
          };
        },
      );

      return { previousValue };
    },
    onError(err, variables, context) {
      client.setQueryData(["stock-portfolio"], context!.previousValue);
    },
    onSettled() {
      client.invalidateQueries(["stock-portfolio"]);
    },
  });
}
