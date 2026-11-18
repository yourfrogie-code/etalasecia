export function formatRupiah(value: number): string {
  if (value === 0) return "Gratis";
  return "Rp" + Math.round(value).toLocaleString("id-ID");
}
