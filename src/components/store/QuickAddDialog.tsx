import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { findOption } from "@/data/products";
import type { Product } from "@/data/types";
import { formatRupiah } from "@/lib/format";
import { PlanPicker, defaultSelection, type PlanSelection } from "./PlanPicker";
import { ProductVisual } from "./ProductVisual";
import { useAddToCart } from "./useAddToCart";

export function QuickAddDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [sel, setSel] = useState<PlanSelection>(() => defaultSelection(product));
  const add = useAddToCart();
  useEffect(() => {
    if (open) setSel(defaultSelection(product));
  }, [open, product]);
  const found = findOption(product, sel.planId, sel.optionId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto rounded-3xl border-2 border-ink bg-card p-5 shadow-sticker">
        <div className="flex items-center gap-3 pr-6">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-ink">
            <ProductVisual product={product} size="sm" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="truncate font-display text-xl">{product.name}</DialogTitle>
            <DialogDescription className="line-clamp-1">{product.short}</DialogDescription>
          </div>
        </div>
        <PlanPicker product={product} value={sel} onChange={setSel} />
        <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-between gap-3 border-t-2 border-dashed border-border bg-card px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Harga</p>
            <p className="font-display text-xl font-bold">
              {found ? formatRupiah(found.option.price) : "-"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outlineInk" size="sm" className="h-11">
              <Link
                to="/produk/$slug"
                params={{ slug: product.slug }}
                onClick={() => onOpenChange(false)}
              >
                Detail
              </Link>
            </Button>
            <Button
              variant="sticker"
              className="h-11"
              onClick={() => {
                if (add(product, sel.planId, sel.optionId)) onOpenChange(false);
              }}
            >
              <ShoppingBag /> Tambah
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
