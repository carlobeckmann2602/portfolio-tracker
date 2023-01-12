import { PortfolioData, StockHoldingAmountMutVars } from ".";

const defaultPortfolioData: PortfolioData = { value: 0, holdings: [] };

/** Gets user's stock holdings from local storage. */
export function getPortfolioFromLocalStorage(): PortfolioData {
  const value = localStorage.getItem("local-stock-portfolio");
  return value ? JSON.parse(value) : defaultPortfolioData;
}

/** Mutates the amount of a given holding in local storage. */
export function mutateHoldingAmountInLocalStorage({
  stockId,
  amountOffset,
}: StockHoldingAmountMutVars) {
  let { holdings } = getPortfolioFromLocalStorage();
  const holdingId = holdings.findIndex((other) => other.stock.id == stockId);
  if (holdingId < 0) return;

  const [holding] = holdings.splice(holdingId, 1);
  const amount = Math.max(0, holding.amount + amountOffset);

  if (amount)
    holdings.push({
      ...holding,
      value: amount * (holding.value / holding.amount),
      amount,
    });

  holdings = holdings.sort((a, b) => a.stock.id - b.stock.id);

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
