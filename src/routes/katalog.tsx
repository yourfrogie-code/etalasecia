import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/data/products";
import { filterCatalog, type SortKey } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/store/ProductCard";
import { SectionHeading } from "@/components/store/SectionHeading";

interface CatalogSearch {
  q?: string;
  kategori?: string;
  sort?: SortKey;
  promo?: boolean;
  tersedia?: boolean;
}

const sorts: { id: SortKey; label: string }[] = [
  { id: "populer", label: "Populer" },
  { id: "termurah", label: "Termurah" },
  { id: "termahal", label: "Termahal" },
  { id: "nama", label: "A–Z" },
];

export const Route = createFileRoute("/katalog")({
  validateSearch: (s: Record<string, unknown>): CatalogSearch => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    kategori: typeof s.kategori === "string" && categories.some((c) => c.id === s.kategori) ? s.kategori : undefined,
    sort: sorts.some((x) => x.id === s.sort) ? (s.sort as SortKey) : undefined,
    promo: s.promo === true || s.promo === "true" ? true : undefined,
    tersedia: s.tersedia === true || s.tersedia === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Katalog Aplikasi Premium — Cia Store" },
      { name: "description", content: "Cari, filter, dan bandingkan harga semua aplikasi premium di Cia Store. Streaming, musik, editing, AI, edukasi & game." },
      { property: "og:title", content: "Katalog Aplikasi Premium — Cia Store" },
      { property: "og:description", content: "Semua aplikasi premium Cia Store dalam satu katalog." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Catalog,
});

const chip = "shrink-0 rounded-full border-2 px-4 py-2 font-display text-sm font-semibold transition-all";
const chipOn = "border-ink bg-ink text-ink-foreground shadow-sticker-sm";
const chipOff = "border-border bg-card hover:border-ink";

function Catalog() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/katalog" });
  const [q, setQ] = useState(search.q ?? "");

  useEffect(() => setQ(search.q ?? ""), [search.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== q) navigate({ search: (p) => ({ ...p, q: q.trim() || undefined }), replace: true });
    }, 200);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => filterCatalog(products, { ...search, q }), [search, q]);
  const activeCat = categories.find((c) => c.id === search.kategori);
  const hasFilter = !!(search.q || search.kategori || search.promo || search.tersedia || search.sort);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading eyebrow="katalog" title={activeCat ? `${activeCat.emoji} ${activeCat.name}` : "Semua aplikasi"} />

      <div className="sticky top-[66px] z-30 -mx-4 space-y-3 bg-background/90 px-4 pb-3 pt-1 backdrop-blur-md">
        <label className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-card px-4 shadow-sticker-sm">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari aplikasi… (mis. netflix, canva)"
            className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Cari produk"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Hapus pencarian" className="grid h-7 w-7 place-items-center rounded-full bg-muted">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <Link to="/katalog" search={(p) => ({ ...p, kategori: undefined })} className={cn(chip, !search.kategori ? chipOn : chipOff)}>Semua</Link>
          {categories.map((c) => (
            <Link key={c.id} to="/katalog" search={(p) => ({ ...p, kategori: c.id })} className={cn(chip, search.kategori === c.id ? chipOn : chipOff)}>
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>

        <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          {sorts.map((s) => {
            const on = (search.sort ?? "populer") === s.id;
            return (
              <button key={s.id} type="button" onClick={() => navigate({ search: (p) => ({ ...p, sort: s.id === "populer" ? undefined : s.id }), replace: true })} className={cn(chip, "py-1.5 text-xs", on ? "border-ink bg-primary text-primary-foreground" : chipOff)}>
                {s.label}
              </button>
            );
          })}
          <span className="mx-1 h-5 w-px shrink-0 bg-border" />
          <button type="button" aria-pressed={!!search.promo} onClick={() => navigate({ search: (p) => ({ ...p, promo: p.promo ? undefined : true }), replace: true })} className={cn(chip, "py-1.5 text-xs", search.promo ? "border-ink bg-blush text-blush-foreground" : chipOff)}>
            🏷️ Promo
          </button>
          <button type="button" aria-pressed={!!search.tersedia} onClick={() => navigate({ search: (p) => ({ ...p, tersedia: p.tersedia ? undefined : true }), replace: true })} className={cn(chip, "py-1.5 text-xs", search.tersedia ? "border-ink bg-primary text-primary-foreground" : chipOff)}>
            ✓ Tersedia
          </button>
        </div>
      </div>

      <div className="mb-4 mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <span><b className="text-foreground">{list.length}</b> produk ditemukan</span>
        {hasFilter && (
          <button type="button" onClick={() => { setQ(""); navigate({ search: {}, replace: true }); }} className="font-display font-semibold text-foreground underline">
            Reset filter
          </button>
        )}
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      ) : (
        <div className="rounded-[2rem] border-2 border-dashed border-ink bg-card p-10 text-center">
          <p className="text-5xl">🥺</p>
          <p className="mt-3 font-display text-xl font-bold">Yah, belum ketemu</p>
          <p className="text-sm text-muted-foreground">Coba kata kunci lain atau reset filternya ya.</p>
        </div>
      )}
    </div>
  );
}
