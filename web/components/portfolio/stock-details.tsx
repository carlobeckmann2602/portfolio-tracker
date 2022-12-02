import React from "react";
import {
  createStockHolding,
  StockHolding,
  stringifyCurrencyValue,
  useStockHoldingMutation,
} from "../../lib/backend";
import { TrendIcon } from "../stock/trend_icon";

const TableRow = ({ children }: React.PropsWithChildren) => (
  <div className="flex justify-between">{children}</div>
);

const CounterButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => (
  <button
    {...props}
    className="rounded-md border border-black w-8 select-none transition disabled:opacity-0"
  />
);

function CounterInput({
  value,
  onChange,
  min,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center">
      <CounterButton
        onClick={() => onChange(value - 1)}
        disabled={min != undefined && min >= value}
      >
        -
      </CounterButton>
      <div className="w-20 text-center">{value}</div>
      <CounterButton onClick={() => onChange(value + 1)}>+</CounterButton>
    </div>
  );
}

export function StockDetails({ holding }: { holding: StockHolding }) {
  const { name, symbol, price } = holding.stock;
  const [count, setCount] = React.useState(holding.amount);
  const holdingMut = useStockHoldingMutation();

  const setAmount = React.useCallback(
    (amount: number) => {
      setCount(amount);
      // Overwrite the current holding with the correct number of shares
      holdingMut.mutate(createStockHolding(holding.stock, amount));
    },
    [holding, holdingMut]
  );

  const removeHolding = React.useCallback(() => {
    // Set the number of shares of the current holding to 0
    holdingMut.mutate(createStockHolding(holding.stock, 0));
  }, [holding, holdingMut]);

  React.useEffect(() => setCount(holding.amount), [holding]);

  return (
    <div className="px-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <TrendIcon trend={0} />
        <div>
          <h2 className="text-2xl mb-0.5 font-medium">{name}</h2>
          <p>{stringifyCurrencyValue(holding.value)}</p>
        </div>
      </div>
      <div className="flex flex-col text-lg gap-2">
        <TableRow>
          <div>Symbol:</div>
          <div>{symbol}</div>
        </TableRow>
        <TableRow>
          <div>Current price:</div>
          <div>{stringifyCurrencyValue(price)}</div>
        </TableRow>
        <TableRow>
          <div>Count:</div>
          <CounterInput value={count} onChange={setAmount} min={1} />
        </TableRow>
      </div>
      <button
        className="text-lg rounded-md border border-black w-full p-4"
        onClick={removeHolding}
      >
        Remove stock
      </button>
    </div>
  );
}