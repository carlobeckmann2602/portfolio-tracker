import cn from "classnames";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./date-picker.module.css";

export type DatePickerProps = Omit<
  ReactDatePickerProps,
  "dateFormat" | "withPortal"
>;

export const DatePicker = ({ className, ...props }: DatePickerProps) => (
  <div className={styles.wrap}>
    <ReactDatePicker
      dateFormat="dd.MM.yyyy"
      withPortal
      className={cn(
        "border-2 outline-none border-solid border-highlight1 p-2 text-center rounded-[10px] bg-front/10 font-bold text-highlight1 text-lg",
        className
      )}
      {...props}
    />
  </div>
);
