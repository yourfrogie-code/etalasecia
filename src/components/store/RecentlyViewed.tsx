import { Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { getProduct } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store-state";
import { ProductVisual } from "./ProductVisual";

export function RecentlyViewed({
  exclude,
  title = "Baru kamu lihat",
}: {
  exclude?: string;
  title?: string;
}) {
  const { recent, ready } = useStore();
  const list = recent
    .filter((s) => s !== exclude)
    .map(getProduct)
    .filter((p): p is NonNullable<typeof p> => !!p);
  if (!ready || list.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <History className="h-5 w-5" /> {title}
      </h2>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {list.map((p) => (
          <Link
            key={p.slug}
            to="/produk/$slug"
            params={{ slug: p.slug }}
            className="group w-36 shrink-0 overflow-hidden rounded-2xl border-2 border-ink bg-card transition-transform hover:-translate-y-1"
          >
            <div className="aspect-square border-b-2 border-ink">
              <ProductVisual product={p} size="sm" />
            </div>
            <div className="p-2">
              <p className="truncate font-display text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                mulai {formatRupiah(startingPrice(p))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
