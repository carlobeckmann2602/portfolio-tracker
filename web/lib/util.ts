const intlNum = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

/** Converts a monetary value to a localized string with currency. */
export function formatCurrencyValue(value: number) {
  return intlNum.format(value);
}
