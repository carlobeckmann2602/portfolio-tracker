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
  const { mutate: mutateHoldingAmount, isLoading: mutationIsLoading } =
    useStockHoldingAmountMut();
  const portfolioIsLoading = usePortfolioData().isFetching;
  const isLoading = mutationIsLoading || portfolioIsLoading;

  const [tempAmount, setTempAmount] = useState(holding.amount);
  useEffect(() => setTempAmount(holding.amount), [holding]);

  const { data: stock } = useStock(holding.id);

  const updateAmount = useCallback(
    (amountOffset: number) => () => {
      setTempAmount(tempAmount + amountOffset);
      mutateHoldingAmount({
        stockId: holding.id,
        amountOffset,
      });
    },
    [tempAmount, holding, mutateHoldingAmount]
  );

  const removeHolding = useCallback(() => {
    // Set the number of shares of the current holding to 0
    mutateHoldingAmount({
      stockId: holding.id,
      amountOffset: -holding.amount,
    });
  }, [holding, mutateHoldingAmount]);

  const trendElem: JSX.Element = stock ? <>{stock.trend}%</> : <>&nbsp;</>;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div
          className="flex items-center gap-3 xs:gap-4 rounded-xl px-3 xs:px-4 py-3 bg-front/10 border-2 border-front/20 transition duration-500"
          style={{ borderColor: selectionColor }}
        >
          <TrendIcon trend={stock?.trend} />
          <div className="flex justify-between items-center flex-1 text-sm xs:text-base">
            <div className="flex-1">
              <h3 className="text-xl xs:text-2xl">{holding.name}</h3>
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
            <div>{stock ? formatCurrencyValue(stock.price) : <>&nbsp;</>}</div>
          </TableRow>
          <TableRow>
            <div>Trend:</div>
            <div>{trendElem}</div>
          </TableRow>
          <TableRow>
            <div>Count:</div>
            <CounterInput
              value={tempAmount}
              onIncrement={updateAmount(1)}
              onDecrement={updateAmount(-1)}
              min={1}
              disabled={isLoading}
            />
          </TableRow>
        </div>
      </div>
      <Button onClick={removeHolding} disabled={isLoading}>
        Remove stock
      </Button>
    </div>
  );
}
