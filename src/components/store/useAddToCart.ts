import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { findOption } from "@/data/products";
import type { Product } from "@/data/types";
import { formatRupiah } from "@/lib/format";
import { useStore } from "@/lib/store-state";

export function useAddToCart() {
  const { addToCart } = useStore();
  const router = useRouter();
  return (product: Product, planId: string, optionId: string, qty = 1) => {
    const found = findOption(product, planId, optionId);
    if (!found || found.option.available === false) {
      toast.error("Paket ini belum tersedia");
      return false;
    }
    addToCart({ slug: product.slug, planId, optionId, qty });
    toast.success(`${product.name} masuk keranjang 🛒`, {
      description: `${found.plan.name} — ${found.option.label} · ${formatRupiah(found.option.price)}`,
      action: { label: "Lihat", onClick: () => router.navigate({ to: "/keranjang" }) },
    });
    return true;
  };
}
