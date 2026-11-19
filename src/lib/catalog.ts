import { getCategory } from "@/data/products";
import type { Product } from "@/data/types";
import { startingPrice } from "./pricing";

export type SortKey = "populer" | "termurah" | "termahal" | "nama";

export function searchProducts(list: Product[], q: string): Product[] {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return list;
  return list.filter((p) => {
    const hay = [
      p.name,
      p.short,
      p.description,
      p.category,
      getCategory(p.category)?.name ?? "",
      ...p.plans.map((pl) => pl.name),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}

export interface CatalogFilter {
  q?: string | undefined;
  kategori?: string | undefined;
  sort?: SortKey | undefined;
  promo?: boolean | undefined;
  tersedia?: boolean | undefined;
}

export function filterCatalog(list: Product[], f: CatalogFilter): Product[] {
  let out = searchProducts(list, f.q ?? "");
  if (f.kategori) out = out.filter((p) => p.category === f.kategori);
  if (f.promo) out = out.filter((p) => p.promo);
  if (f.tersedia) out = out.filter((p) => p.available !== false);
  const sorted = [...out];
  switch (f.sort) {
    case "termurah":
      sorted.sort((a, b) => startingPrice(a) - startingPrice(b));
      break;
    case "termahal":
      sorted.sort((a, b) => startingPrice(b) - startingPrice(a));
      break;
    case "nama":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      sorted.sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  }
  return sorted;
}
