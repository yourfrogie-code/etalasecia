import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Info, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { store } from "@/config/store";
import { formatRupiah } from "@/lib/format";
import type { ResolvedCartItem } from "@/lib/cart";
import { useStore } from "@/lib/store-state";
import { buildOrderMessage, whatsappUrl } from "@/lib/whatsapp";
import { ProductVisual } from "@/components/store/ProductVisual";
import { SectionHeading } from "@/components/store/SectionHeading";
import { WhatsappIcon } from "@/components/layout/FloatingActions";

export const Route = createFileRoute("/keranjang")({
  head: () => ({
    meta: [
      { title: "Keranjang Belanja — Cia Store" },
      {
        name: "description",
        content: "Periksa pesananmu dan checkout langsung via WhatsApp Cia Store.",
      },
      { property: "og:title", content: "Keranjang Belanja — Cia Store" },
      { property: "og:description", content: "Checkout pesanan aplikasi premium via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartRow({ item }: { item: ResolvedCartItem }) {
  const { setQty, removeItem, changeVariant } = useStore();
  const value = `${item.planId}::${item.optionId}`;
  return (
    <li className="animate-rise rounded-3xl border-2 border-ink bg-card p-3 shadow-sticker-sm sm:p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <Link
          to="/produk/$slug"
          params={{ slug: item.slug }}
          className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-ink sm:h-20 sm:w-20"
        >
          <ProductVisual product={item.product} size="sm" />
        </Link>
        <div className="min-w-0">
          <Link
            to="/produk/$slug"
            params={{ slug: item.slug }}
            className="block truncate font-display text-lg font-bold hover:underline"
          >
            {item.product.name}
          </Link>
          <label className="mt-1 block">
            <span className="sr-only">Ganti paket</span>
            <select
              value={value}
              onChange={(e) => {
                const [planId, optionId] = e.target.value.split("::");
                if (planId && optionId) changeVariant(item.key, planId, optionId);
              }}
              className="w-full max-w-full truncate rounded-xl border-2 border-border bg-background px-2 py-1.5 text-sm font-semibold outline-none focus:border-ink"
            >
              {item.product.plans.map((pl) => (
                <optgroup key={pl.id} label={pl.name}>
                  {pl.options
                    .filter((o) => o.available !== false)
                    .map((o) => (
                      <option key={o.id} value={`${pl.id}::${o.id}`}>
                        {pl.name} — {o.label} ({formatRupiah(o.price)})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatRupiah(item.option.price)} / item
          </p>
        </div>
        <button
          type="button"
          aria-label={`Hapus ${item.product.name}`}
          onClick={() => {
            removeItem(item.key);
            toast(`${item.product.name} dihapus dari keranjang`);
          }}
          className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
        <div className="flex items-center gap-1 rounded-full border-2 border-ink bg-background p-1">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            onClick={() => setQty(item.key, item.qty - 1)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-display font-bold">{item.qty}</span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={() => setQty(item.key, item.qty + 1)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="font-display text-lg font-bold">{formatRupiah(item.subtotal)}</p>
      </div>
    </li>
  );
}

function CartPage() {
  const { cart, cartTotal, cartCount, note, setNote, clearCart, ready } = useStore();
  const [opened, setOpened] = useState(false);

  const checkout = () => {
    const msg = buildOrderMessage(
      cart.map((i) => ({
        productName: i.product.name,
        planName: i.plan.name,
        optionLabel: i.option.label,
        qty: i.qty,
        unitPrice: i.option.price,
      })),
      note,
    );
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
    setOpened(true);
  };

  if (!ready) {
    return (
      <div className="mx-auto grid max-w-6xl place-items-center px-4 py-24">
        <span
          className="h-10 w-10 animate-spin rounded-full border-4 border-secondary border-t-ink"
          aria-label="Memuat keranjang"
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="relative mx-auto w-fit">
          <img
            src={store.logo}
            alt=""
            className="h-40 w-40 animate-float rounded-full border-2 border-ink bg-secondary object-cover shadow-sticker"
          />
          <span className="absolute -right-3 top-2 tag-sticker rotate-12">kosong?!</span>
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Keranjangmu masih kosong</h1>
        <p className="mt-2 text-muted-foreground">
          Yuk pilih aplikasi premium favoritmu dulu, Cia tungguin ya ✿
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild variant="sticker" size="lg">
            <Link to="/katalog">
              <ShoppingBag /> Mulai belanja
            </Link>
          </Button>
          <Button asChild variant="outlineInk" size="lg">
            <Link to="/favorit">Lihat favorit</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading eyebrow="hampir selesai" title={`Keranjang (${cartCount})`} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-3">
          {cart.map((i) => (
            <CartRow key={i.key} item={i} />
          ))}
        </ul>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[1.75rem] border-2 border-ink bg-card p-5 shadow-sticker">
            <h2 className="font-display text-xl font-bold">Ringkasan pesanan</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {cart.map((i) => (
                <li key={i.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <span className="truncate text-muted-foreground">
                    {i.qty}× {i.product.name} · {i.option.label}
                  </span>
                  <span className="font-semibold">{formatRupiah(i.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t-2 border-dashed border-border pt-3 text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatRupiah(cartTotal)}</span>
            </div>
            <div className="mt-1 flex items-end justify-between">
              <span className="font-display font-bold">Total</span>
              <span className="font-display text-3xl font-bold">{formatRupiah(cartTotal)}</span>
            </div>

            <label className="mt-4 block">
              <span className="font-display text-sm font-semibold">
                Catatan tambahan (opsional)
              </span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Mis. email untuk invite, nama profil, atau pertanyaan lain…"
                className="mt-1.5 min-h-24 rounded-2xl border-2 border-border bg-background focus-visible:border-ink"
              />
            </label>

            <Button variant="whatsapp" size="lg" className="mt-4 w-full" onClick={checkout}>
              <WhatsappIcon className="h-5 w-5" /> CHECKOUT VIA WHATSAPP
            </Button>
            <p className="mt-2 flex gap-1.5 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Pesan pesanan akan terisi otomatis di WhatsApp. Pesanan baru diterima setelah kamu
              menekan tombol kirim di WhatsApp.
            </p>

            {opened && (
              <div className="mt-4 rounded-2xl bg-secondary p-3 text-sm text-secondary-foreground animate-rise">
                <p className="font-display font-bold">WhatsApp sudah dibuka 💬</p>
                <p className="mt-0.5">
                  Sudah menekan kirim di WhatsApp? Kalau iya, kamu boleh mengosongkan keranjang.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="ink"
                    onClick={() => {
                      clearCart();
                      toast("Keranjang dikosongkan");
                    }}
                  >
                    Sudah dikirim, kosongkan
                  </Button>
                  <Button size="sm" variant="outlineInk" onClick={checkout}>
                    Buka lagi
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Link
            to="/katalog"
            className="mt-3 block text-center font-display text-sm font-semibold underline"
          >
            + Tambah produk lain
          </Link>
        </aside>
      </div>
    </div>
  );
}
