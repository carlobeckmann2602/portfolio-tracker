import { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { formatCurrencyValue } from "../../lib/util";
import {
  StockHolding,
  usePortfolioData,
  useStock,
  useStockHoldingAmountMut,
} from "../../lib/backend";
import { Button } from "../button";
import { TrendIcon } from "../stock/trend_icon";
import {
  HoldingAmountCounterMutation,
  RemoveHoldingButton,
} from "./amount-mutation";

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
      "rounded-md bg-highlight1 text-back font-semibold w-8 select-none transition",
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
}: {
  holding: StockHolding;
  selectionColor: string;
}) {
  const trendElem: JSX.Element = (
    <>
      {holding.stock.trend < 0 ? "-" : "+"}
      {Math.abs(holding.stock.trend).toFixed(2).replace(".", ",")}%
    </>
  );

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div
          className="flex items-center gap-3 xs:gap-4 rounded-xl px-3 xs:px-4 py-3 bg-front/10 border-2 border-front/20 transition duration-500"
          style={{ borderColor: selectionColor }}
        >
          <TrendIcon trend={holding.stock.trend} />
          <div className="flex justify-between items-center flex-1 gap-4 text-sm xs:text-base">
            <div className="flex-1">
              <h3 className="text-xl xs:text-2xl">{holding.stock.name}</h3>
              <p className="font-light">{trendElem}</p>
            </div>
            <div className="flex-shrink-0">
              <p className="font-light">{formatCurrencyValue(holding.value)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col font-light xs:text-lg gap-2">
          <TableRow>
            <div>Current price:</div>
            <div>{formatCurrencyValue(holding.stock.price)}</div>
          </TableRow>
          <TableRow>
            <div>Trend:</div>
            <div>{trendElem}</div>
          </TableRow>
          <TableRow>
            <div>Count:</div>
            <HoldingAmountCounterMutation holding={holding} />
          </TableRow>
        </div>
      </div>
      <RemoveHoldingButton holding={holding} />
    </div>
  );
}
