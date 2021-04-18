export function formatMoney(value) {
  return Intl.NumberFormat(["en-us"], {
    minimumFractionDigits: 2,
  }).format(value);
}
