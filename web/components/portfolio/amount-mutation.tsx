import { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import {
  StockHolding,
  usePortfolioData,
  useStockHoldingAmountMut,
} from "../../lib/backend";
import { Button } from "../button";

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

function useAmountMutationInProgress() {
  const { isLoading: mutationIsLoading } = useStockHoldingAmountMut();
  const { isFetching: portfolioIsLoading } = usePortfolioData();

  return mutationIsLoading || portfolioIsLoading;
}

export function HoldingAmountCounterMutation({
  holding,
}: {
  holding: StockHolding;
}) {
  const { mutate: mutateHoldingAmount } = useStockHoldingAmountMut();
  const isLoading = useAmountMutationInProgress();

  const [tempAmount, setTempAmount] = useState(holding.amount);
  useEffect(() => setTempAmount(holding.amount), [holding]);

  const createAmountMutFn = useCallback(
    (amountOffset: number) => () => {
      setTempAmount(tempAmount + amountOffset);
      mutateHoldingAmount({
        stockId: holding.stock.id,
        pricePerShare: holding.stock.price,
        date: new Date(),
        amountOffset,
        stock: holding.stock,
      });
    },
    [tempAmount, holding, mutateHoldingAmount]
  );

  return (
    <CounterInput
      value={tempAmount}
      onIncrement={createAmountMutFn(1)}
      onDecrement={createAmountMutFn(-1)}
      min={1}
      disabled={isLoading}
    />
  );
}

export function RemoveHoldingButton({ holding }: { holding: StockHolding }) {
  const { mutate: mutateHoldingAmount } = useStockHoldingAmountMut();
  const isLoading = useAmountMutationInProgress();

  const removeHolding = useCallback(() => {
    // Set the number of shares of the current holding to 0
    mutateHoldingAmount({
      stockId: holding.stock.id,
      pricePerShare: holding.value / holding.amount,
      date: new Date(),
      amountOffset: -holding.amount,
      stock: holding.stock,
    });
  }, [holding, mutateHoldingAmount]);

  return (
    <Button onClick={removeHolding} disabled={isLoading}>
      Remove stock
    </Button>
  );
}
