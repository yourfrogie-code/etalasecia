import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Info, Minus, Plus, Share2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { findOption, getCategory, getProduct, products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { savingsPercent } from "@/lib/pricing";
import { useStore } from "@/lib/store-state";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import { PlanPicker, defaultSelection, type PlanSelection } from "@/components/store/PlanPicker";
import { ProductVisual } from "@/components/store/ProductVisual";
import { ProductBadges, ProductCard, WishButton } from "@/components/store/ProductCard";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";
import { useAddToCart } from "@/components/store/useAddToCart";
import { WhatsappIcon } from "@/components/layout/FloatingActions";

export const Route = createFileRoute("/produk/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug, name: product.name, short: product.short };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} Premium — Cia Store` },
          {
            name: "description",
            content: `${loaderData.short} Pilih paket & durasi ${loaderData.name}, pesan via WhatsApp di Cia Store.`,
          },
          { property: "og:title", content: `${loaderData.name} Premium — Cia Store` },
          { property: "og:description", content: loaderData.short },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Produk tidak ditemukan — Cia Store" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl">🫣</p>
      <h1 className="mt-3 font-display text-2xl font-bold">Produk tidak ditemukan</h1>
      <Button asChild variant="sticker" className="mt-6">
        <Link to="/katalog">Kembali ke katalog</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const product = getProduct(slug)!;
  const cat = getCategory(product.category);
  const router = useRouter();
  const { pushRecent } = useStore();
  const add = useAddToCart();
  const [sel, setSel] = useState<PlanSelection>(() => defaultSelection(product));
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSel(defaultSelection(product));
    setQty(1);
    pushRecent(product.slug);
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const found = findOption(product, sel.planId, sel.optionId);
  const price = found?.option.price ?? 0;
  const pct = found ? savingsPercent(found.plan, found.option) : 0;
  const available = product.available !== false && found?.option.available !== false;

  const orderNow = () => {
    if (!found) return;
    const msg = buildOrderMessage([
      {
        productName: product.name,
        planName: found.plan.name,
        optionLabel: found.option.label,
        qty,
        unitPrice: found.option.price,
      },
    ]);
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
    toast("WhatsApp dibuka 💬", {
      description: "Pesanan baru terkirim setelah kamu menekan tombol kirim di WhatsApp.",
    });
  };

  const copyInfo = async () => {
    const lines = [
      `${product.name} — ${product.short}`,
      product.note ? `Keterangan: ${product.note}` : "",
      "",
      ...product.plans.flatMap((pl) => [
        `【${pl.name}】${pl.note ? ` (${pl.note})` : ""}`,
        ...pl.options.map(
          (o) =>
            `• ${o.label}: ${o.available === false ? "tidak tersedia" : formatRupiah(o.price)}`,
        ),
      ]),
      "",
      `Pesan di Cia Store: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      toast.success("Info produk disalin 📋");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Gagal menyalin, coba lagi ya");
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${product.name} — Cia Store`, url });
      } catch {
        /* dibatalkan */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link produk disalin");
    }
  };

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="mb-4 inline-flex items-center gap-1 font-display text-sm font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:gap-10">
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border-2 border-ink shadow-sticker md:aspect-square">
              <ProductVisual product={product} size="lg" />
              <ProductBadges product={product} className="absolute left-4 top-4" />
              <WishButton product={product} className="absolute right-4 top-4 h-11 w-11" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outlineInk" onClick={copyInfo} className="h-11">
                {copied ? <Check /> : <Copy />} Salin info
              </Button>
              <Button variant="outlineInk" onClick={share} className="h-11">
                <Share2 /> Bagikan
              </Button>
            </div>
          </div>

          <div className="min-w-0 animate-rise">
            <Link
              to="/katalog"
              search={{ kategori: product.category }}
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:underline"
            >
              {cat?.emoji} {cat?.name}
            </Link>
            <h1 className="mt-1 font-display text-4xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
            <p
              className={`mt-2 inline-flex items-center gap-1.5 text-sm font-bold ${product.available !== false ? "text-success" : "text-muted-foreground"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${product.available !== false ? "bg-success" : "bg-muted-foreground"}`}
              />
              {product.available !== false ? "Tersedia" : "Tidak tersedia"}
            </p>

            {product.note && (
              <div className="mt-4 flex gap-2 rounded-2xl border-2 border-dashed border-mocha bg-card p-3 text-sm">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-mocha" />
                <p>
                  <b className="font-display">Keterangan:</b> {product.note}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-[1.75rem] border-2 border-ink bg-card p-4 sm:p-5">
              <PlanPicker product={product} value={sel} onChange={setSel} />

              <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-dashed border-border pt-4">
                <span className="font-display text-sm font-semibold">Jumlah</span>
                <div className="flex items-center gap-1 rounded-full border-2 border-ink bg-background p-1">
                  <button
                    type="button"
                    aria-label="Kurangi"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-display font-bold" aria-live="polite">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Tambah"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {found ? `${found.plan.name} · ${found.option.label}` : "Pilih paket"}
                  </p>
                  <p className="font-display text-3xl font-bold">{formatRupiah(price * qty)}</p>
                </div>
                {pct > 0 && (
                  <span className="rounded-full border-2 border-ink bg-blush px-3 py-1 font-display text-xs font-bold text-blush-foreground">
                    hemat {pct}% ✿
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button
                  variant="sticker"
                  size="lg"
                  disabled={!available}
                  onClick={() => add(product, sel.planId, sel.optionId, qty)}
                >
                  <ShoppingBag /> Tambah ke keranjang
                </Button>
                <Button variant="whatsapp" size="lg" disabled={!available} onClick={orderNow}>
                  <WhatsappIcon className="h-5 w-5" /> Pesan via WhatsApp
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-2 text-sm sm:grid-cols-3">
              {[
                "Proses cepat di jam operasional",
                "Garansi sesuai keterangan",
                "Bayar setelah chat admin",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-secondary-foreground"
                >
                  <Check className="h-4 w-4 shrink-0" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-4 font-display text-xl font-bold">Lainnya di {cat?.name}</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
      <RecentlyViewed exclude={product.slug} />
    </>
  );
}
