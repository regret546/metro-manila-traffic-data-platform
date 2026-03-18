export function formatCurrency(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return String(n);

  // Keep output simple/consistent: PHP prefix, no symbol rendering differences by locale.
  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(n);

  return `PHP ${formatted}`;
}

