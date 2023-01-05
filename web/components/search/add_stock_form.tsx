import { Stock, useStockHoldingAmountMut } from "../../lib/backend";
import { BaseSyntheticEvent, useState } from "react";
import { Button } from "../button";
import { Number } from "../form/number";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const addStockAndCloseSearch = (stock: Stock) => {
    onAdd();
    mutateHoldingAmount({
      stockId: stock.id,
      amountOffset: stockAmount,
      price: stock.price,
      date: purchaseDate,
    });
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
          Money spent <span className="inline-block">(in €)</span>
        </label>
        <Number
          name="price"
          className="w-1/3"
          value={(stockAmount * stock.price).toFixed(2)}
          disabled
        />
      </div>
      <div className="mb-4">
        <label className="font-light">Purchase date</label>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          withPortal
          className="mt-4 border-2 outline-none border-solid border-highlight1 p-2 text-center rounded-[10px] bg-front/10 font-bold text-highlight1 text-lg"
          selected={purchaseDate}
          onChange={(date: Date) => setPurchaseDate(date)}
        />
      </div>
      <Button look={1} onClick={() => addStockAndCloseSearch(stock)}>
        Add
      </Button>
    </div>
  );
};
