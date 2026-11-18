import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Flame, Heart, Plus, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/data/products";
import type { Product } from "@/data/types";
import { formatRupiah } from "@/lib/format";
import { bestSaving, startingPrice } from "@/lib/pricing";
import { useStore } from "@/lib/store-state";
import { cn } from "@/lib/utils";
import { ProductVisual } from "./ProductVisual";
import { QuickAddDialog } from "./QuickAddDialog";

export function WishButton({ product, className }: { product: Product; className?: string }) {
  const { isWished, toggleWish } = useStore();
  const on = isWished(product.slug);
  return (
    <button
      type="button"
      aria-label={on ? "Hapus dari favorit" : "Tambah ke favorit"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        const added = toggleWish(product.slug);
        toast(added ? `${product.name} disimpan ke favorit 💚` : `${product.name} dihapus dari favorit`);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-card transition-transform hover:scale-110 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", on ? "fill-blush text-blush-foreground" : "text-foreground")} />
    </button>
  );
}

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {product.popular && (
        <span className="tag-sticker text-[11px]"><Flame className="h-3 w-3" /> Best Seller</span>
      )}
      {product.promo && (
        <span className="inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-blush px-2 py-0.5 font-display text-[11px] font-semibold text-blush-foreground">
          <TicketPercent className="h-3 w-3" /> Promo
        </span>
      )}
      {product.available === false && (
        <span className="rounded-lg bg-muted px-2 py-0.5 font-display text-[11px] font-semibold text-muted-foreground">Kosong</span>
      )}
    </div>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [open, setOpen] = useState(false);
  const saving = bestSaving(product);
  const cat = getCategory(product.category);
  const available = product.available !== false;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-sticker-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sticker animate-rise"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <Link to="/produk/$slug" params={{ slug: product.slug }} className="relative block aspect-[4/3] overflow-hidden border-b-2 border-ink">
        <ProductVisual product={product} />
        <ProductBadges product={product} className="absolute left-2.5 top-2.5" />
        <span
          className={cn(
            "absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-bold",
            available ? "text-success" : "text-muted-foreground",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", available ? "bg-success" : "bg-muted-foreground")} />
          {available ? "Tersedia" : "Tidak tersedia"}
        </span>
      </Link>
      <WishButton product={product} className="absolute right-2.5 top-2.5" />

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{cat?.emoji} {cat?.name}</p>
        <h3 className="font-display text-lg font-bold leading-tight">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>

        <div className="mt-auto space-y-2 pt-1">
          <div>
            <p className="text-[11px] text-muted-foreground">mulai dari</p>
            <p className="font-display text-xl font-bold">{formatRupiah(startingPrice(product))}</p>
          </div>
          {saving && (
            <p className="rounded-xl bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary-foreground">
              ✿ Ambil {saving.option.label} lebih hemat {saving.pct}%
            </p>
          )}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button asChild variant="outlineInk" size="sm" className="h-10">
              <Link to="/produk/$slug" params={{ slug: product.slug }}><Eye /> Detail</Link>
            </Button>
            <Button
              variant="sticker"
              size="icon"
              aria-label={`Tambah ${product.name} ke keranjang`}
              disabled={!available}
              onClick={() => setOpen(true)}
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
      <QuickAddDialog product={product} open={open} onOpenChange={setOpen} />
    </article>
  );
}
