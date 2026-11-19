import type { PlanOption, Product, ProductPlan } from "@/data/types";

/** Durasi dalam hari dari label opsi, mis. "3 bulan" → 90. Lifetime/garansi → null. */
export function parseDurationDays(label: string): number | null {
  if (/lifetime|garansi|\/link/i.test(label)) return null;
  const m = label.match(/(\d+)\s*(hari|minggu|bulan|tahun)/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = (m[2] ?? "").toLowerCase();
  const mult = unit === "hari" ? 1 : unit === "minggu" ? 7 : unit === "bulan" ? 30 : 365;
  return n * mult;
}

/**
 * Persentase hemat harga per hari dibanding durasi terpendek di paket yang sama.
 * Mengembalikan 0 jika tidak lebih hemat atau tidak bisa dibandingkan.
 */
export function savingsPercent(plan: ProductPlan, option: PlanOption): number {
  const days = parseDurationDays(option.label);
  if (!days || !option.price) return 0;
  const priced = plan.options
    .map((o) => ({ o, d: parseDurationDays(o.label) }))
    .filter(
      (x): x is { o: PlanOption; d: number } => !!x.d && x.o.price > 0 && x.o.available !== false,
    );
  if (priced.length < 2) return 0;
  const shortest = priced.reduce((a, b) => (b.d < a.d ? b : a));
  if (shortest.d >= days) return 0;
  const basePerDay = shortest.o.price / shortest.d;
  const perDay = option.price / days;
  const pct = Math.round((1 - perDay / basePerDay) * 100);
  return pct >= 5 ? pct : 0;
}

export function availableOptions(product: Product) {
  return product.plans.flatMap((plan) =>
    plan.options.filter((o) => o.available !== false).map((option) => ({ plan, option })),
  );
}

/** Harga termurah yang tersedia (untuk "mulai dari"). */
export function startingPrice(product: Product): number {
  const prices = availableOptions(product).map((x) => x.option.price);
  const paid = prices.filter((p) => p > 0);
  if (paid.length) return Math.min(...paid);
  return prices.length ? Math.min(...prices) : 0;
}

export function highestPrice(product: Product): number {
  const prices = availableOptions(product).map((x) => x.option.price);
  return prices.length ? Math.max(...prices) : 0;
}

/** Opsi dengan penghematan terbesar di seluruh paket produk. */
export function bestSaving(product: Product) {
  let best: { plan: ProductPlan; option: PlanOption; pct: number } | null = null;
  for (const plan of product.plans) {
    for (const option of plan.options) {
      if (option.available === false) continue;
      const pct = savingsPercent(plan, option);
      if (pct > 0 && (!best || pct > best.pct)) best = { plan, option, pct };
    }
  }
  return best;
}

export function perDayPrice(option: PlanOption): number | null {
  const d = parseDurationDays(option.label);
  if (!d || !option.price) return null;
  return option.price / d;
}
