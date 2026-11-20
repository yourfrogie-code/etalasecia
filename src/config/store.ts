/**
 * Identitas toko — ubah teks, nomor, dan tautan di sini saja.
 * Semua halaman membaca nilai dari file ini.
 */
import logoAsset from "@/assets/cia-store-logo.png.asset.json";
import headerAsset from "@/assets/cia-store-header.webp.asset.json";

export const store = {
  name: "Cia Store",
  handle: "@etalasecia",
  hashtag: "#langganandicia",
  since: 2021,
  tagline: "Toko aplikasi premium yang lucu, murah, dan amanah",
  logo: logoAsset.url,
  headerImage: headerAsset.url,

  /** Nomor WhatsApp toko (boleh diawali 0, +62, atau 62). */
  whatsappNumber: "081369272965",
  /** Tautan halaman testimoni milik toko. */
  testimonialUrl: "[LINK_TESTIMONI_SAYA]",

  announcement: [
    "Selamat datang di Cia Store ✿ akun premium bergaransi",
    "Durasi lebih panjang = harga per hari lebih hemat",
    "Pesan langsung via WhatsApp, tinggal ketuk!",
  ],

  hero: {
    eyebrow: "photobooth of premium apps",
    title: "Hai, selamat datang di Cia Store!",
    description:
      "Tempat jajan aplikasi premium favoritmu — dari nonton, musik, editing, AI sampai kebutuhan game. Pilih paket, ketuk, dan pesan via WhatsApp.",
    primaryCta: "Jelajahi Katalog",
    secondaryCta: "Chat Admin",
  },

  profile: {
    bio: "Akun premium legal & bergaransi ✿ Fast respon ✿ Sejak 2021 menemani hiburan & kerjaanmu.",
    info: [
      { icon: "clock", label: "Jam operasional", value: "10.00 – 00.00 WIB" },
      { icon: "shield", label: "Garansi", value: "Sesuai keterangan" },
      { icon: "wallet", label: "Pembayaran", value: "QRIS" },
    ],
  },

  social: [
    { label: "Twitter / X", href: "https://x.com/ciajajan" },
  ],

  faq: [
    {
      q: "Bagaimana cara memesan?",
      a: "Pilih aplikasi, tentukan paket & durasi, lalu tambahkan ke keranjang. Buka keranjang dan ketuk “Checkout via WhatsApp” — pesan pesanan akan terisi otomatis, tinggal kamu kirim.",
    },
    {
      q: "Bagaimana cara melakukan pembayaran?",
      a: "Setelah pesananmu kami terima di WhatsApp, admin akan mengirimkan detail pembayaran via QRIS.",
    },
    {
      q: "Berapa lama proses pesanan?",
      a: "Biasanya 5–30 menit setelah pembayaran dikonfirmasi pada jam operasional. Saat ramai, mohon ditunggu sebentar ya.",
    },
    {
      q: "Bagaimana cara menghubungi penjual?",
      a: "Ketuk tombol WhatsApp hijau di pojok layar atau tombol “Chat Admin” — kamu akan langsung terhubung dengan admin Cia Store.",
    },
    {
      q: "Apakah akun bergaransi?",
      a: "Ya, garansi mengikuti keterangan di setiap produk. Simpan bukti pembelian dan ikuti ketentuan pada keterangan agar garansi berlaku penuh.",
    },
  ],
} as const;

export type StoreConfig = typeof store;
