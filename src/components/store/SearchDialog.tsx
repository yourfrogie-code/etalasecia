import { useMemo, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { startingPrice } from "@/lib/pricing";
import { searchProducts } from "@/lib/catalog";
import { ProductVisual } from "./ProductVisual";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const results = useMemo(
    () =>
      q.trim()
        ? searchProducts(products, q).slice(0, 8)
        : products.filter((p) => p.popular).slice(0, 6),
    [q],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[10%] max-w-lg translate-y-0 rounded-3xl border-2 border-ink bg-card p-4 pt-12 shadow-sticker">
        <DialogTitle className="sr-only">Cari produk</DialogTitle>
        <DialogDescription className="sr-only">Ketik nama aplikasi untuk mencari</DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            router.navigate({ to: "/katalog", search: { q: q.trim() || undefined } });
          }}
          className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-background px-3 pr-10"
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari Netflix, Canva, ChatGPT…"
            className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </form>
        <p className="px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {q.trim() ? `${results.length} hasil` : "Lagi populer"}
        </p>
        <ul className="-mx-1 max-h-[55dvh] space-y-1 overflow-y-auto">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                to="/produk/$slug"
                params={{ slug: p.slug }}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-secondary"
              >
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border-2 border-ink">
                  <ProductVisual product={p} size="sm" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display font-semibold">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.short}</span>
                </span>
                <span className="shrink-0 text-sm font-bold">{formatRupiah(startingPrice(p))}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
              Belum ketemu nih 🥺 coba kata lain ya.
            </li>
          )}
        </ul>
        {q.trim() && (
          <Link
            to="/katalog"
            search={{ q: q.trim() }}
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center gap-1 rounded-2xl bg-secondary py-2.5 font-display text-sm font-semibold"
          >
            Lihat semua di katalog <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
