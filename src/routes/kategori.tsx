import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories, productsByCategory } from "@/data/products";
import { SectionHeading } from "@/components/store/SectionHeading";
import { StoreIcon } from "@/components/store/icons";
import { toneBg } from "@/components/store/ProductVisual";

export const Route = createFileRoute("/kategori")({
  head: () => ({
    meta: [
      { title: "Kategori Aplikasi — Cia Store" },
      { name: "description", content: "Jelajahi aplikasi premium berdasarkan kategori: Entertainment, Music, Editing, AI, Education, Other, dan Game Needs." },
      { property: "og:title", content: "Kategori Aplikasi — Cia Store" },
      { property: "og:description", content: "Pilih kategori aplikasi premium favoritmu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionHeading eyebrow="mau cari apa?" title="Kategori" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const items = productsByCategory(c.id);
          return (
            <Link
              key={c.id}
              to="/katalog"
              search={{ kategori: c.id }}
              className="group animate-rise rounded-[1.75rem] border-2 border-ink bg-card p-5 shadow-sticker-sm transition-all hover:-translate-y-1 hover:shadow-sticker"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="story-ring shrink-0 rounded-full p-[3px]">
                  <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-card bg-secondary">
                    <StoreIcon name={c.icon} className="h-7 w-7" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-bold">{c.emoji} {c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {items.slice(0, 5).map((p) => (
                    <span key={p.slug} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ink ${toneBg[p.tone]}`} title={p.name}>
                      <StoreIcon name={p.icon} className="h-4 w-4 text-ink" />
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-muted-foreground">{items.length} aplikasi</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
