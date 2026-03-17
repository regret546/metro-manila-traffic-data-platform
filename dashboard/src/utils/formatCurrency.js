export function formatCurrency(n, currency = "USD") {
  if (typeof n !== "number" || Number.isNaN(n)) return String(n);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

