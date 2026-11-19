import { Check, Info } from "lucide-react";
import type { Product } from "@/data/types";
import { formatRupiah } from "@/lib/format";
import { perDayPrice, savingsPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export interface PlanSelection {
  planId: string;
  optionId: string;
}

export function defaultSelection(product: Product): PlanSelection {
  for (const plan of product.plans) {
    const opt = plan.options.find((o) => o.available !== false);
    if (opt) return { planId: plan.id, optionId: opt.id };
  }
  return { planId: product.plans[0]?.id ?? "", optionId: product.plans[0]?.options[0]?.id ?? "" };
}

/** Pilihan paket (tab) + durasi (kartu harga) yang interaktif. */
export function PlanPicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: PlanSelection;
  onChange: (v: PlanSelection) => void;
}) {
  const plan = product.plans.find((p) => p.id === value.planId) ?? product.plans[0];
  if (!plan) return null;

  return (
    <div className="space-y-4">
      {product.plans.length > 1 && (
        <div>
          <p className="mb-2 font-display text-sm font-semibold text-muted-foreground">
            1. Pilih paket
          </p>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {product.plans.map((p) => {
              const active = p.id === plan.id;
              const usable = p.options.some((o) => o.available !== false);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={!usable}
                  onClick={() => {
                    const first = p.options.find((o) => o.available !== false);
                    if (first) onChange({ planId: p.id, optionId: first.id });
                  }}
                  className={cn(
                    "shrink-0 rounded-full border-2 px-4 py-2 font-display text-sm font-semibold transition-all",
                    active
                      ? "border-ink bg-ink text-ink-foreground shadow-sticker-sm"
                      : "border-border bg-card hover:border-ink",
                    !usable && "cursor-not-allowed opacity-50 line-through",
                  )}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {plan.note && (
        <p className="flex gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <b className="font-display">Keterangan {plan.name}:</b> {plan.note}
          </span>
        </p>
      )}

      <div>
        <p className="mb-2 font-display text-sm font-semibold text-muted-foreground">
          {product.plans.length > 1 ? "2. Pilih durasi" : "Pilih durasi / varian"}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {plan.options.map((o) => {
            const active = o.id === value.optionId && plan.id === value.planId;
            const pct = savingsPercent(plan, o);
            const perDay = perDayPrice(o);
            const disabled = o.available === false;
            return (
              <button
                key={o.id}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ planId: plan.id, optionId: o.id })}
                className={cn(
                  "relative flex min-h-20 flex-col items-start justify-between rounded-2xl border-2 p-3 text-left transition-all",
                  active
                    ? "border-ink bg-primary text-primary-foreground shadow-sticker-sm -translate-y-0.5"
                    : "border-border bg-card hover:border-ink",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {pct > 0 && (
                  <span className="absolute -right-1.5 -top-2.5 rounded-full border-2 border-ink bg-blush px-2 py-0.5 font-display text-[10px] font-bold text-blush-foreground">
                    hemat {pct}%
                  </span>
                )}
                <span className="pr-4 text-xs font-bold leading-tight">
                  {o.label === "-" ? "Belum tersedia" : o.label}
                </span>
                <span className="mt-1 font-display text-base font-bold">
                  {disabled ? "Habis" : formatRupiah(o.price)}
                </span>
                {perDay && !disabled && (
                  <span
                    className={cn(
                      "text-[10px]",
                      active ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    ≈ {formatRupiah(Math.ceil(perDay))}/hari
                  </span>
                )}
                {active && <Check className="absolute bottom-2 right-2 h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
