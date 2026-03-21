export function formatPrice(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
  }).format(value);
}

export function parseSizes(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
