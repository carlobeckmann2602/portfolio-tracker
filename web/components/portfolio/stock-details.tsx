import React from "react";
import cn from "classnames";
import {
  StockHolding,
  stringifyCurrencyValue,
  useStockHoldingAmountMut,
} from "../../lib/backend";
import { Button } from "../button";
import { TrendIcon } from "../stock/trend_icon";

const TableRow = ({ children }: React.PropsWithChildren) => (
  <div className="flex justify-between">{children}</div>
);

const CounterButton = ({
  hidden,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { hidden?: boolean }) => (
  <button
    {...props}
    className={cn(
      "rounded-md bg-highlight1 text-back font-semibold w-8 select-none transition disabled:opacity-50",
      hidden ? "opacity-0" : props.disabled ? "opacity-50" : null
    )}
  />
);

function CounterInput({
  value,
  onDecrement,
  onIncrement,
  min,
  disabled,
}: {
  value: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
  min?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center">
      <CounterButton
        onClick={() => onDecrement?.()}
        hidden={min != undefined && min >= value}
        disabled={disabled}
      >
        -
      </CounterButton>
      <div className="w-20 text-center">{value}</div>
      <CounterButton onClick={() => onIncrement?.()} disabled={disabled}>
        +
      </CounterButton>
    </div>
  );
}

export function StockDetails({
  holding,
  selectionColor,
  isLoading,
}: {
  holding: StockHolding;
  selectionColor: string;
  isLoading?: boolean;
}) {
  const holdingAmountMut = useStockHoldingAmountMut();

  const updateAmount = React.useCallback(
    (amountOffset: number) => () => {
      holdingAmountMut.mutate({
        stockId: holding.id,
        amountOffset,
      });
    },
    [holding, holdingAmountMut]
  );

  const removeHolding = React.useCallback(() => {
    // Set the number of shares of the current holding to 0
    holdingAmountMut.mutate({
      stockId: holding.id,
      amountOffset: -holding.amount,
    });
  }, [holding, holdingAmountMut]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div
          className="flex items-center gap-3 xs:gap-4 rounded-xl px-3 xs:px-4 py-3 bg-front/10 border-2 border-front/20 transition duration-500"
          style={{ borderColor: selectionColor }}
        >
          <TrendIcon trend={0} />
          <div className="flex justify-between items-center flex-1 text-sm xs:text-base">
            <div className="flex-1">
              <h3 className="text-xl xs:text-2xl">{holding.name}</h3>
              <p className="font-light">+ 0,00 %</p>
            </div>
            <div className="flex-shrink-0">
              <p className="font-light">
                {stringifyCurrencyValue(holding.value)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-light xs:text-lg gap-2">
          <TableRow>
            <div>Current price:</div>
            <div>{stringifyCurrencyValue(0)}</div>
          </TableRow>
          <TableRow>
            <div>Trend:</div>
            <div>+ 0,00 %</div>
          </TableRow>
          <TableRow>
            <div>Count:</div>
            <CounterInput
              value={holding.amount}
              onIncrement={updateAmount(1)}
              onDecrement={updateAmount(-1)}
              min={1}
              disabled={isLoading || holdingAmountMut.isLoading}
            />
          </TableRow>
        </div>
      </div>
      <Button onClick={removeHolding}>Remove stock</Button>
    </div>
  );
}
