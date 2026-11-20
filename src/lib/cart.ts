import { findOption, getProduct } from "@/data/products";
import type { PlanOption, Product, ProductPlan } from "@/data/types";

export interface CartItem {
  slug: string;
  planId: string;
  optionId: string;
  qty: number;
}

export interface ResolvedCartItem extends CartItem {
  key: string;
  product: Product;
  plan: ProductPlan;
  option: PlanOption;
  subtotal: number;
}

export const itemKey = (i: Pick<CartItem, "slug" | "planId" | "optionId">) =>
  `${i.slug}|${i.planId}|${i.optionId}`;

/** Gabungkan item sama (produk+paket+durasi) dan buang yang qty ≤ 0. */
export function mergeCart(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const it of items) {
    if (it.qty <= 0) continue;
    const k = itemKey(it);
    const ex = map.get(k);
    map.set(
      k,
      ex ? { ...ex, qty: Math.min(99, ex.qty + it.qty) } : { ...it, qty: Math.min(99, it.qty) },
    );
  }
  return [...map.values()];
}

export function resolveCart(items: CartItem[]): ResolvedCartItem[] {
  const out: ResolvedCartItem[] = [];
  for (const it of items) {
    const product = getProduct(it.slug);
    if (!product) continue;
    const found = findOption(product, it.planId, it.optionId);
    if (!found || found.option.available === false) continue;
    out.push({ ...it, key: itemKey(it), product, ...found, subtotal: found.option.price * it.qty });
  }
  return out;
}
