import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";
import { StoreIcon } from "./icons";

export const toneBg: Record<Product["tone"], string> = {
  1: "bg-tile-1",
  2: "bg-tile-2",
  3: "bg-tile-3",
  4: "bg-tile-4",
  5: "bg-tile-5",
  6: "bg-tile-6",
};

/** Gambar produk: memakai `product.image` jika ada, kalau tidak ilustrasi polaroid. */
export function ProductVisual({ product, size = "md", className }: { product: Product; size?: "sm" | "md" | "lg"; className?: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  const big = size === "lg";
  const small = size === "sm";
  return (
    <div className={cn("relative grid h-full w-full place-items-center overflow-hidden bg-grain", toneBg[product.tone], className)}>
      <span aria-hidden className="absolute left-3 top-2 font-display text-2xl text-ink/25">✦</span>
      <span aria-hidden className="absolute bottom-3 right-4 font-display text-lg text-ink/25">♡</span>
      <span aria-hidden className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-card/30" />
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "grid place-items-center rounded-2xl border-2 border-ink bg-card text-ink shadow-sticker-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
            big ? "h-24 w-24 rounded-3xl" : small ? "h-10 w-10 rounded-xl" : "h-16 w-16",
          )}
        >
          <StoreIcon name={product.icon} className={big ? "h-11 w-11" : small ? "h-5 w-5" : "h-8 w-8"} />
        </div>
        {!small && (
          <span className={cn("tag-sticker max-w-[90%] truncate", big ? "text-lg" : "text-xs")}>{product.name}</span>
        )}
      </div>
    </div>
  );
}
