import React from "react";
import { StockHolding } from "../../lib/backend";

const TableRow = ({ children }: React.PropsWithChildren) => (
  <div className="flex justify-between">{children}</div>
);

function CounterInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center">
      <button
        className="rounded-md border border-black w-8 select-none"
        onClick={() => onChange(value - 1)}
      >
        -
      </button>
      <div className="w-20 text-center">{value}</div>
      <button
        className="rounded-md border border-black w-8 select-none"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

export function StockDetails({ holding }: { holding: StockHolding }) {
  const { name, symbol, high } = holding.stock;
  const [count, setCount] = React.useState(holding.amount);
  React.useEffect(() => setCount(holding.amount), [holding]);

  return (
    <div className="px-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full w-16 h-16 bg-gray-300"></div>
        <div>
          <h2 className="text-2xl mb-0.5 font-medium">{name}</h2>
          <p>{holding.amount.toFixed(2)}€</p>
        </div>
      </div>
      <div className="flex flex-col text-lg gap-2">
        <TableRow>
          <div>Symbol:</div>
          <div>{symbol}</div>
        </TableRow>
        <TableRow>
          <div>Current price:</div>
          <div>{high}€</div>
        </TableRow>
        <TableRow>
          <div>Count:</div>
          <CounterInput value={count} onChange={setCount} />
        </TableRow>
      </div>
      <button className="text-lg rounded-md border border-black w-full p-4">
        Remove all
      </button>
    </div>
  );
}
