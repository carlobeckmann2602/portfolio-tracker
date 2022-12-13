import React from "react";
import {
  createStockHolding,
  StockHolding,
  stringifyCurrencyValue,
  useStockHoldingMutation,
} from "../../lib/backend";
import { Button } from "../button";
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
    className="rounded-md bg-highlight1 text-back font-semibold w-8 select-none transition disabled:opacity-0"
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
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4 rounded-xl px-4 py-3 bg-front/10 border-2 border-front/20">
          <TrendIcon trend={0} />
          <div className="flex justify-between items-center flex-1">
            <div className="flex-1">
              <h3 className="text-2xl">{name}</h3>
              <p className="font-light">+ 0,00 %</p>
            </div>
            <div>
              <p className="font-light">
                {stringifyCurrencyValue(holding.value)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col xs:text-lg gap-2">
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
      </div>
      <Button onClick={removeHolding}>Remove stock</Button>
    </div>
  );
}
