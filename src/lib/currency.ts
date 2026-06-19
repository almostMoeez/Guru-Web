// The Guru backend stores prices as PKR decimals (returned as strings by mysql2).
// All UI money formatting goes through here so currency is consistent app-wide.

/** Parse a backend decimal (string | number) into a safe number. */
export const toAmount = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const pkrFormatter = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Format an amount as PKR, e.g. 1295 -> "Rs 1,295". */
export const formatPKR = (value: string | number | null | undefined): string =>
  `Rs ${pkrFormatter.format(Math.round(toAmount(value)))}`;
