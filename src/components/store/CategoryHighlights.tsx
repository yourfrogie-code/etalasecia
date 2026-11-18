import { Link } from "@tanstack/react-router";
import { categories, productsByCategory } from "@/data/products";
import { StoreIcon } from "./icons";

/** Lingkaran kategori ala story highlights. Tambah kategori di src/data/products.ts. */
export function CategoryHighlights() {
  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:gap-6 md:justify-center">
      <Link to="/katalog" className="group flex w-20 shrink-0 flex-col items-center gap-2">
        <span className="grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-ink bg-card font-display text-2xl transition-transform group-hover:scale-105">✦</span>
        <span className="text-center font-display text-xs font-semibold">Semua</span>
      </Link>
      {categories.map((c) => (
        <Link key={c.id} to="/katalog" search={{ kategori: c.id }} className="group flex w-20 shrink-0 flex-col items-center gap-2">
          <span className="story-ring rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
            <span className="relative grid h-[74px] w-[74px] place-items-center rounded-full border-[3px] border-background bg-secondary">
              <StoreIcon name={c.icon} className="h-7 w-7 text-ink" />
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-card text-sm">{c.emoji}</span>
            </span>
          </span>
          <span className="w-full truncate text-center font-display text-xs font-semibold">{c.name}</span>
          <span className="-mt-1.5 text-[10px] text-muted-foreground">{productsByCategory(c.id).length} app</span>
        </Link>
      ))}
    </div>
  );
}
