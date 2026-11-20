import { describe, expect, it } from "vitest";
import { getProduct, findOption } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { parseDurationDays, savingsPercent, startingPrice } from "@/lib/pricing";
import { buildOrderMessage, normalizeWhatsappNumber, whatsappUrl } from "@/lib/whatsapp";
import { mergeCart } from "@/lib/cart";
import { filterCatalog } from "@/lib/catalog";
import { products } from "@/data/products";

describe("Harga dari daftar penjual", () => {
  it("Netflix 1P1U 1 bulan = Rp42.000", () => {
    const n = getProduct("netflix")!;
    expect(findOption(n, "1p1u", "1-bulan")?.option.price).toBe(42000);
  });
  it("Unlock Documents Scribd doc = Rp1.500 per link", () => {
    const u = getProduct("unlock-documents")!;
    expect(u.plans[0]!.options[0]!.price).toBe(1500);
  });
  it("Temen Mabar gratis dan tampil 'Gratis'", () => {
    const m = getProduct("mlbb")!;
    const opt = m.plans[0]!.options.find((o) => o.label === "Temen Mabar")!;
    expect(opt.price).toBe(0);
    expect(formatRupiah(opt.price)).toBe("Gratis");
  });
  it("Crunchyroll private tidak tersedia", () => {
    const c = getProduct("crunchyroll")!;
    expect(c.plans.find((p) => p.id === "private")!.options[0]!.available).toBe(false);
  });
  it("mulai dari Netflix = Rp6.000", () => {
    expect(startingPrice(getProduct("netflix")!)).toBe(6000);
  });
});

describe("Durasi lebih panjang lebih hemat", () => {
  it("membaca durasi", () => {
    expect(parseDurationDays("3 bulan")).toBe(90);
    expect(parseDurationDays("1 minggu 6U")).toBe(7);
    expect(parseDurationDays("Lifetime garansi 6 bulan")).toBeNull();
  });
  it("Netflix 1P1U 3 bulan hemat dibanding 1 hari", () => {
    const n = getProduct("netflix")!;
    const plan = n.plans[0]!;
    const three = plan.options.find((o) => o.label === "3 bulan")!;
    // 6000/hari vs 125000/90 ≈ 1389/hari → hemat 77%
    expect(savingsPercent(plan, three)).toBe(77);
    expect(savingsPercent(plan, plan.options[0]!)).toBe(0);
  });
});

describe("Pesan WhatsApp", () => {
  it("nomor 081369272965 jadi 6281369272965", () => {
    expect(normalizeWhatsappNumber("081369272965")).toBe("6281369272965");
    expect(whatsappUrl("hai")).toBe("https://wa.me/6281369272965?text=hai");
  });
  it("memuat produk, paket, jumlah, total, dan catatan", () => {
    const msg = buildOrderMessage(
      [
        {
          productName: "Netflix",
          planName: "1P1U",
          optionLabel: "1 bulan",
          qty: 2,
          unitPrice: 42000,
        },
        {
          productName: "Canva Pro",
          planName: "MEMBER",
          optionLabel: "1 bulan",
          qty: 1,
          unitPrice: 10000,
        },
      ],
      "email: saya@contoh.com",
    );
    expect(msg).toContain("*Netflix*");
    expect(msg).toContain("Paket: 1P1U — 1 bulan");
    expect(msg).toContain("Jumlah: 2 x Rp42.000 = Rp84.000");
    expect(msg).toContain("Total pembayaran: Rp94.000");
    expect(msg).toContain("Catatan: email: saya@contoh.com");
  });
  it("URL di-encode sehingga baris baru & simbol aman", () => {
    const url = whatsappUrl("Halo kak\nTotal: Rp10.000 & catatan #1");
    expect(url).toContain("Halo%20kak%0ATotal%3A%20Rp10.000%20%26%20catatan%20%231");
  });
});

describe("Keranjang & katalog", () => {
  it("item sama digabung dan qty 0 dibuang", () => {
    const merged = mergeCart([
      { slug: "netflix", planId: "1p1u", optionId: "1-bulan", qty: 1 },
      { slug: "netflix", planId: "1p1u", optionId: "1-bulan", qty: 2 },
      { slug: "canva", planId: "member", optionId: "1-bulan", qty: 0 },
    ]);
    expect(merged).toEqual([{ slug: "netflix", planId: "1p1u", optionId: "1-bulan", qty: 3 }]);
  });
  it("urut termurah menaruh harga terendah di depan", () => {
    const list = filterCatalog(products, { sort: "termurah" });
    expect(startingPrice(list[0]!)).toBeLessThanOrEqual(startingPrice(list[1]!));
  });
  it("filter kategori music hanya berisi music", () => {
    const list = filterCatalog(products, { kategori: "music" });
    expect(list.map((p) => p.slug).sort()).toEqual(["apple-music", "spotify", "youtube"]);
  });
});
