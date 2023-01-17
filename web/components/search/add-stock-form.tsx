import { Stock, useStockHoldingAmountMut } from "../../lib/backend";
import { BaseSyntheticEvent, useState } from "react";
import { Button } from "../button";
import { Number } from "../form/number";
import { DatePicker } from "../form/date-picker";

export type AddStockFormProps = {
  stock: Stock;
  onAdd: () => void;
};

export const AddStockForm = ({ stock, onAdd }: AddStockFormProps) => {
  const [stockAmount, setStockAmount] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date());
  const { mutate: mutateHoldingAmount } = useStockHoldingAmountMut();
  const updateAmount = (evt: BaseSyntheticEvent) => {
    setStockAmount(evt.target.value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="w-1/3 font-light">Total stocks purchased</label>
        <Number
          name="amount"
          className="w-1/3"
          defaultValue={stockAmount}
          onChange={(evt) => updateAmount(evt)}
          min={1}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <label className="w-1/3 font-light">
          Price per share <span className="inline-block">(in euros)</span>
        </label>
        <Number
          name="price"
          className="w-1/3"
          defaultValue={stock.price.toFixed(2)}
        />
      </div>
      <div className="mb-4">
        <label className="font-light">Purchase date</label>
        <DatePicker
          className="mt-4"
          selected={purchaseDate}
          onChange={(date) => {
            if (date) setPurchaseDate(date);
          }}
        />
      </div>
      <Button
        look={1}
        onClick={() => {
          onAdd();
          mutateHoldingAmount({
            stockId: stock.id,
            amountOffset: stockAmount,
            pricePerShare: stock.price,
            date: purchaseDate,
            stock,
          });
        }}
      >
        Add
      </Button>
    </div>
  );
};
