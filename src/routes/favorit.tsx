import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store-state";
import { ProductCard } from "@/components/store/ProductCard";
import { SectionHeading } from "@/components/store/SectionHeading";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";

export const Route = createFileRoute("/favorit")({
  head: () => ({
    meta: [
      { title: "Favorit Saya — Cia Store" },
      { name: "description", content: "Daftar aplikasi premium yang kamu simpan di Cia Store." },
      { property: "og:title", content: "Favorit Saya — Cia Store" },
      { property: "og:description", content: "Aplikasi premium favoritmu di Cia Store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { wishlist, ready } = useStore();
  const list = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <SectionHeading eyebrow="disimpan" title="Favorit saya 💚" />
        {ready && list.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-ink bg-card p-10 text-center">
            <Heart className="mx-auto h-12 w-12 animate-wiggle text-mocha" />
            <p className="mt-3 font-display text-xl font-bold">Belum ada favorit</p>
            <p className="text-sm text-muted-foreground">
              Ketuk ikon hati di kartu produk untuk menyimpannya di sini.
            </p>
            <Button asChild variant="sticker" className="mt-5">
              <Link to="/katalog">Jelajahi katalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <RecentlyViewed />
    </>
  );
}
