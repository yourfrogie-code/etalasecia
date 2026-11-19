import { store } from "@/config/store";
import { formatRupiah } from "./format";

export interface OrderLine {
  productName: string;
  planName: string;
  optionLabel: string;
  qty: number;
  unitPrice: number;
}

/** Ubah nomor lokal (08…, +62…) menjadi format wa.me (628…). Kosong jika tidak valid. */
export function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

export function buildOrderMessage(lines: OrderLine[], note?: string): string {
  const out: string[] = [];
  out.push(`Halo kak ${store.name} 👋`);
  out.push("Saya ingin memesan produk berikut ya kak:");
  out.push("");
  lines.forEach((l, i) => {
    out.push(`${i + 1}. *${l.productName}*`);
    out.push(`   Paket: ${l.planName} — ${l.optionLabel}`);
    out.push(
      `   Jumlah: ${l.qty} x ${formatRupiah(l.unitPrice)} = ${formatRupiah(l.unitPrice * l.qty)}`,
    );
  });
  out.push("");
  out.push(`*Total pembayaran: ${formatRupiah(orderTotal(lines))}*`);
  const cleanNote = note?.trim();
  out.push(`Catatan: ${cleanNote ? cleanNote : "-"}`);
  out.push("");
  out.push("Mohon info cara pembayarannya ya kak. Terima kasih banyak 🙏✨");
  return out.join("\n");
}

export function whatsappUrl(message: string, number: string = store.whatsappNumber): string {
  const n = normalizeWhatsappNumber(number);
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function chatAdminUrl(): string {
  return whatsappUrl(
    `Halo kak ${store.name} 👋 Saya ingin bertanya tentang produk aplikasi premium.`,
  );
}

export function isExternalLinkReady(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
