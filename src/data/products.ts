/**
 * Katalog Cia Store. Harga ditulis dalam ribuan (k), mis. 42 = Rp42.000.
 * Tambah produk/paket baru cukup dengan menambah entri di bawah.
 */
import type { Category, CategoryId, Product, ProductPlan } from "./types";

export const categories: Category[] = [
  { id: "entertainment", name: "Entertainment", emoji: "🎬", icon: "clapperboard", blurb: "Streaming film, drakor & anime" },
  { id: "music", name: "Music", emoji: "🎧", icon: "headphones", blurb: "Dengar lagu tanpa iklan" },
  { id: "editing", name: "Editing", emoji: "✂️", icon: "scissors", blurb: "Edit foto & video makin kece" },
  { id: "ai", name: "AI", emoji: "🤖", icon: "bot", blurb: "Asisten AI pintar" },
  { id: "education", name: "Education", emoji: "📚", icon: "book", blurb: "Belajar & produktif" },
  { id: "other", name: "Other", emoji: "🧸", icon: "heart", blurb: "Aplikasi serba-serbi" },
  { id: "game", name: "Game Needs", emoji: "🎮", icon: "gamepad", blurb: "Kebutuhan game favorit" },
];

const slug = (s: string) =>
  s.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** price: harga dalam ribuan; null = tidak tersedia. */
function plan(name: string, options: [string, number | null][], note?: string): ProductPlan {
  return {
    id: slug(name),
    name,
    note,
    options: options.map(([label, price]) => ({
      id: slug(label),
      label,
      price: price == null ? 0 : Math.round(price * 1000),
      available: price != null,
    })),
  };
}

type Def = Omit<Product, "plans" | "slug"> & { slug?: string; plans: ProductPlan[] };
const def = (p: Def): Product => ({ ...p, slug: p.slug ?? slug(p.name) });

export const products: Product[] = [
  // ───────────── ENTERTAINMENT ─────────────
  def({
    name: "Netflix", category: "entertainment", icon: "clapperboard", tone: 2, popular: true,
    short: "Nonton film & series favorit kualitas HD 4K.",
    description: "Streaming film, series, dan dokumenter Netflix dengan kualitas tinggi. Tersedia banyak pilihan paket mulai dari harian sampai private.",
    note: "wajib mengisi form order dan mengirimkan bukti login untuk full garansi, kualitas hd 4k limit screen 4",
    plans: [
      plan("1P1U", [["1 hari", 6], ["3 hari", 12], ["7 hari", 18], ["14 hari", 28], ["1 bulan", 42], ["2 bulan", 80], ["3 bulan", 125]], "sharing 5 user limit screen 4"),
      plan("1P2U", [["1 bulan", 28], ["2 bulan", 55], ["3 bulan", 85]], "sharing 10 user limit screen 4"),
      plan("SEMIPRIV", [["1 bulan", 55]], "sharing 5 user login 2 perangkat limit screen 4"),
      plan("ANTI LIMIT", [["1 bulan", 70]], "sharing 1 user memiliki 2 profile"),
      plan("PRIVATE", [["1 bulan", 170]], "private 1 user memiliki 5 profile bebas sharing"),
    ],
  }),
  def({
    name: "Disney+", category: "entertainment", icon: "star", tone: 6, popular: true,
    short: "Film Disney, Marvel, Pixar & Star Wars.",
    description: "Nikmati film Disney, Pixar, Marvel, Star Wars, dan series eksklusif Disney+ Hotstar.",
    note: "login dengan otp harap stand by dengan seller, limit screen 4",
    plans: [
      plan("PREMIUM PLAN", [["1 hari 6U", 5], ["3 hari 6U", 12], ["5 hari 6U", 15], ["1 minggu 6U", 20], ["1 bulan 6U", 32], ["1 bulan 3U", 55]]),
      plan("PRIVATE", [["1 bulan (premium)", 150], ["1 bulan (basic)", 80]]),
    ],
  }),
  def({
    name: "Amazon Prime", category: "entertainment", icon: "tv", tone: 4,
    short: "Prime Video dengan film & original series.",
    description: "Akses katalog Prime Video lengkap dengan film dan Amazon Original series.",
    note: "login tv wajib beli 2 slot jika kategori sharing, direkomendasikan membeli private",
    plans: [
      plan("SHARING", [["1 hari", 2], ["7 hari", 10], ["1 bulan (3U)", 15], ["2 bulan (3U)", 25], ["3 bulan (3U)", 30]]),
      plan("PRIVATE", [["1 bulan", 20], ["2 bulan", 35], ["3 bulan", 45]]),
    ],
  }),
  def({
    name: "Viu", category: "entertainment", icon: "drama", tone: 5, promo: true,
    short: "Drakor & variety show Asia terbaru.",
    description: "Streaming drama Korea, variety show, dan konten Asia terbaru di Viu Premium.",
    note: "private akun less limit direkomendasikan hanya login 1 devices",
    plans: [plan("PRIVATE ANLIM", [["1 hari", 2], ["7 hari", 7], ["1 bulan", 10], ["2 bulan", 15], ["3 bulan", 20], ["6 bulan", 40]])],
  }),
  def({
    name: "WeTV", slug: "we-tv", category: "entertainment", icon: "tv", tone: 1,
    short: "Drama China & Asia favorit.",
    description: "Tonton drama China, Thailand, dan Asia lainnya tanpa iklan di WeTV VIP.",
    plans: [
      plan("SHARING", [["1 hari (6U)", 5], ["3 hari (6U)", 7], ["7 hari (6U)", 10], ["1 bulan (5U-6U)", 15], ["3 bulan (5U-6U)", 25], ["1 bulan (3U / ANLIM)", 25]], "6u tidak boleh login tv, direkomendasikan membeli private"),
      plan("PRIVATE", [["1 bulan", 35]]),
    ],
  }),
  def({
    name: "iQIYI", slug: "iqiyi", category: "entertainment", icon: "film", tone: 4,
    short: "Drama Asia & anime kualitas jernih.",
    description: "Streaming drama Asia, anime, dan variety show di iQIYI VIP.",
    plans: [
      plan("SHARING STANDARD", [["1 hari", 3], ["5 hari", 5], ["1 bulan", 15], ["3 bulan", 30]]),
      plan("SHARING PREMIUM", [["1 bulan", 20]]),
      plan("PRIVATE", [["Standar 1 bulan", 35], ["Premium 1 bulan", 40]]),
    ],
  }),
  def({
    name: "Youku", category: "entertainment", icon: "film", tone: 3,
    short: "Drama & film China terlengkap.",
    description: "Nikmati drama dan film China terbaru di Youku VIP.",
    plans: [
      plan("SHARING", [["1 hari", 4], ["3 hari", 7], ["1 bulan", 12], ["3 bulan", 20]], "login tv wajib beli 2 slot jika kategori sharing, direkomendasikan membeli private"),
      plan("PRIVATE", [["1 bulan", 38], ["3 bulan", 80]]),
    ],
  }),
  def({
    name: "HBO", category: "entertainment", icon: "clapperboard", tone: 6,
    short: "Series & film HBO berkualitas.",
    description: "Tonton series ikonik dan film blockbuster HBO.",
    plans: [
      plan("STANDAR SHARING", [["7 hari", 15], ["1 bulan", 25]]),
      plan("ULTIMATE SHARING", [["7 hari", 20], ["1 bulan", 35]]),
      plan("PRIVATE", [["1 bulan (standar)", 75], ["1 bulan (ultimate/premium)", 125]]),
    ],
  }),
  def({
    name: "Vidio", category: "entertainment", icon: "tv", tone: 2,
    short: "Sinetron, olahraga & film Indonesia.",
    description: "Streaming sinetron, film Indonesia, dan siaran olahraga di Vidio.",
    plans: [
      plan("PRIVATE PLATINUM", [["1 bulan (all devices)", 55], ["1 bulan (mobile only)", 40], ["1 bulan (tv only)", 25]], "all devices bisa semua jenis perangkat, mobile hanya handphone, tv hanya tv"),
      plan("ULTIMATE PRIVATE", [["1 bulan (all devices)", 165], ["1 bulan (mobile only)", 95]]),
    ],
  }),
  def({
    name: "Loklok", category: "entertainment", icon: "popcorn", tone: 5,
    short: "Film & series dalam satu aplikasi.",
    description: "Akses film dan series dari berbagai negara di Loklok.",
    plans: [
      plan("BASIC SHARING", [["1 bulan (3U)", 27], ["1 bulan (4U)", 25]]),
      plan("BASIC PRIVATE", [["1 bulan", 60]]),
      plan("STANDARD SHARING", [["1 bulan", 30]]),
      plan("STANDARD PRIVATE", [["1 bulan", 80]]),
    ],
  }),
  def({
    name: "Bstation", category: "entertainment", icon: "popcorn", tone: 4,
    short: "Anime & konten kreator favorit.",
    description: "Nonton anime terbaru dan konten favorit di Bstation Premium.",
    plans: [plan("SHARING", [["1 bulan", 15], ["3 bulan", 25]]), plan("PRIVATE", [["1 bulan", 40]])],
  }),
  def({
    name: "Crunchyroll", category: "entertainment", icon: "sword", tone: 3,
    short: "Surganya anime simulcast.",
    description: "Tonton anime simulcast dan katalog anime terlengkap di Crunchyroll.",
    plans: [plan("SHARING", [["7 hari", 12], ["14 hari", 16], ["1 bulan", 20]]), plan("PRIVATE", [["-", null]])],
  }),
  def({
    name: "GagaOOLala", slug: "gagaoolala", category: "entertainment", icon: "heart", tone: 2,
    short: "Series & film BL/GL Asia.",
    description: "Streaming series dan film dari GagaOOLala.",
    plans: [plan("SHARING", [["1 bulan", 15], ["3 bulan", 25]])],
  }),
  def({
    name: "Melolo", category: "entertainment", icon: "drama", tone: 6,
    short: "Drama pendek seru setiap hari.",
    description: "Nikmati drama pendek dan series vertikal di Melolo.",
    plans: [plan("SHARING", [["7 hari", 15], ["1 bulan", 20], ["3 bulan", 30]]), plan("PRIVATE", [["1 bulan", 55]])],
  }),
  def({
    name: "Viki", category: "entertainment", icon: "drama", tone: 1,
    short: "Drama Asia dengan subtitle lengkap.",
    description: "Tonton drama Korea, China, dan Jepang dengan subtitle di Viki Pass.",
    plans: [
      plan("SHARING", [["1 bulan (plus)", 20], ["1 bulan (standard)", 18]]),
      plan("PRIVATE", [["1 bulan (plus)", 40], ["1 bulan (standard)", 30]]),
    ],
  }),
  def({
    name: "Mango TV", category: "entertainment", icon: "tv", tone: 5,
    short: "Variety show & drama China.",
    description: "Streaming variety show dan drama China di Mango TV.",
    plans: [plan("SHARING", [["1 bulan", 13]])],
  }),
  def({
    name: "Catchplay+", slug: "catchplay", category: "entertainment", icon: "film", tone: 3,
    short: "Film box office pilihan.",
    description: "Tonton film box office dan film pilihan di Catchplay+.",
    plans: [plan("SHARING", [["1 bulan", 20]])],
  }),

  // ───────────── MUSIC ─────────────
  def({
    name: "YouTube Premium", slug: "youtube", category: "music", icon: "disc", tone: 2, popular: true,
    short: "YouTube tanpa iklan + YouTube Music.",
    description: "Tonton YouTube tanpa iklan, putar di latar belakang, dan dengarkan YouTube Music.",
    note: "akun wajib fresh tidak pernah premium dalam jangka waktu satu tahun, indplan perlu email dan sandi cust, akun dari seller add +2k",
    plans: [
      plan("FAMPLAN", [["1 bulan", 10], ["2 bulan", 17]], "satu akun dapat digunakan 2 kali famplan dalam satu tahun"),
      plan("INDPLAN", [["1 bulan", 20], ["3 bulan (RENEW)", 45], ["3 bulan (NO RENEW)", 60]]),
      plan("MIXPLAN", [["3 bulan", 45], ["4 bulan", 55]]),
    ],
  }),
  def({
    name: "Spotify", category: "music", icon: "music", tone: 1, popular: true,
    short: "Dengar musik & podcast tanpa iklan.",
    description: "Spotify Premium: bebas iklan, skip sepuasnya, dan download lagu untuk didengar offline.",
    note: "jika akun ppj maka akan di replace/timpa folls hilang playlist aman, akun dari seller tidak tambah biaya",
    plans: [plan("INDPLAN", [["1 bulan", 35], ["2 bulan", 55]]), plan("FAMPLAN", [["1 bulan", 25], ["2 bulan", 40]])],
  }),
  def({
    name: "Apple Music", category: "music", icon: "headphones", tone: 6,
    short: "Jutaan lagu kualitas lossless.",
    description: "Dengarkan jutaan lagu dengan kualitas tinggi di Apple Music.",
    plans: [plan("FAMPLAN", [["1 bulan", 23], ["2 bulan", 30]]), plan("INDPLAN", [["1 bulan", 30]])],
  }),

  // ───────────── EDITING ─────────────
  def({
    name: "CapCut Pro", category: "editing", icon: "scissors", tone: 3, popular: true,
    short: "Edit video dengan fitur Pro lengkap.",
    description: "Buka semua efek, template, dan fitur Pro CapCut untuk konten yang makin kece.",
    plans: [
      plan("SHARING 2U", [["7 hari", 12], ["1 bulan", 25]], "akun yang limit tidak bergaransi, direkomendasikan membeli private"),
      plan("PRIVATE", [["7 hari", 20], ["1 bulan", 35]]),
    ],
  }),
  def({
    name: "Canva Pro", slug: "canva", category: "editing", icon: "palette", tone: 4, popular: true, promo: true,
    short: "Desain apa saja dengan elemen Pro.",
    description: "Akses jutaan elemen, template, dan fitur Pro Canva untuk desain sehari-hari.",
    note: "send email dan masuk team seller, harap selalu backup design, full garansi sistem renewal tiap bulan",
    plans: [
      plan("MEMBER", [["1 hari", 3], ["7 hari", 5], ["1 bulan", 10], ["2 bulan", 12], ["3 bulan", 17], ["4 bulan", 20], ["6 bulan", 30]], "Designer: add +1k"),
    ],
  }),
  def({
    name: "Alight Motion", category: "editing", icon: "wand", tone: 5, promo: true,
    short: "Animasi & motion graphic di HP.",
    description: "Buat animasi, motion graphic, dan edit video dengan Alight Motion Pro.",
    plans: [plan("SHARING", [["1 bulan", 10], ["1 tahun", 25]]), plan("PRIVATE", [["1 bulan", 15], ["1 tahun", 30]])],
  }),
  def({
    name: "Meitu", category: "editing", icon: "camera", tone: 2,
    short: "Edit foto & retouch wajah.",
    description: "Edit foto, retouch, dan filter cantik dengan Meitu VIP.",
    note: "all devices bisa andro/ip vip tidak termasuk fitur vip+ dan HD",
    plans: [plan("PRIVATE", [["VIP 7 hari", 15], ["VIP+ 7 hari", 20], ["VIP 1 bulan", 30], ["VIP+ 1 bulan", 40]])],
  }),
  def({
    name: "Wink", category: "editing", icon: "sparkles", tone: 6,
    short: "Retouch video & foto otomatis.",
    description: "Perbaiki kualitas video dan foto dengan fitur premium Wink.",
    plans: [plan("PRIVATE", [["7 hari", 25], ["1 bulan", 60]])],
  }),
  def({
    name: "Dazzcam iOS", slug: "dazzcam-ios", category: "editing", icon: "camera", tone: 3,
    short: "Kamera vintage estetik untuk iPhone.",
    description: "Kamera dengan filter film & vintage estetik untuk iOS.",
    plans: [plan("LIFETIME", [["Garansi 6 bulan", 30]])],
  }),
  def({
    name: "OldRoll", slug: "oldroll", category: "editing", icon: "camera", tone: 1,
    short: "Kamera analog klasik.",
    description: "Hasilkan foto bernuansa kamera analog klasik dengan OldRoll.",
    plans: [plan("LIFETIME", [["Garansi 6 bulan", 35]])],
  }),
  def({
    name: "Beauty Plus", category: "editing", icon: "sparkles", tone: 2,
    short: "Selfie cantik dengan filter premium.",
    description: "Edit selfie dan foto dengan filter serta fitur premium Beauty Plus.",
    plans: [plan("IOS", [["Lifetime garansi 6 bulan", 33]]), plan("ANDROID", [["Lifetime garansi 6 bulan", 30]])],
  }),

  // ───────────── AI ─────────────
  def({
    name: "ChatGPT Plus", category: "ai", icon: "bot", tone: 4, popular: true,
    short: "Asisten AI untuk tugas & kerjaan.",
    description: "Akses ChatGPT Plus untuk menulis, belajar, coding, dan membantu pekerjaan sehari-hari.",
    plans: [plan("SHARING 5U", [["1 bulan", 45]]), plan("SHARING 3U", [["1 bulan", 65]]), plan("PRIVATE", [["1 bulan", 165]])],
  }),
  def({
    name: "Claude Pro", category: "ai", icon: "brain", tone: 3,
    short: "AI cerdas untuk menulis & analisis.",
    description: "Claude Pro untuk menulis, merangkum dokumen panjang, dan analisis.",
    plans: [
      plan("SHARING 3U", [["7 hari", 65], ["1 bulan", 170]]),
      plan("SHARING 5U", [["7 hari", 60], ["1 bulan", 150]]),
      plan("PRIVATE", [["7 hari", 140], ["1 bulan", 400]]),
    ],
  }),
  def({
    name: "Gemini AI", category: "ai", icon: "sparkles", tone: 6,
    short: "AI dari Google untuk produktivitas.",
    description: "Gunakan Gemini Advanced untuk riset, menulis, dan produktivitas.",
    plans: [plan("SHARING", [["1 bulan", 20], ["2 bulan", 35]], "random, bisa akun dari seller atau invite email")],
  }),

  // ───────────── EDUCATION ─────────────
  def({
    name: "Duolingo Super", category: "education", icon: "languages", tone: 1,
    short: "Belajar bahasa tanpa batas.",
    description: "Belajar bahasa tanpa iklan dan hati tak terbatas dengan Duolingo Super.",
    plans: [plan("FAMPLAN / INVITE", [["7 hari", 15], ["1 bulan", 20]]), plan("INDIVIDUAL PLAN", [["1 bulan", 30]])],
  }),
  def({
    name: "Grammarly", category: "education", icon: "pen", tone: 4,
    short: "Tulisan bahasa Inggris makin rapi.",
    description: "Periksa grammar, gaya, dan kejelasan tulisan dengan Grammarly Premium.",
    plans: [plan("SHARING 8U", [["7 hari", 20], ["1 bulan", 25], ["2 bulan", 35], ["3 bulan", 65]])],
  }),
  def({
    name: "WPS Office", category: "education", icon: "file", tone: 2,
    short: "Office lengkap untuk tugas.",
    description: "Dokumen, spreadsheet, presentasi, dan PDF dengan fitur premium WPS Office.",
    plans: [plan("SHARING", [["1 bulan", 20], ["1 tahun", 30]])],
  }),
  def({
    name: "Kilonotes", category: "education", icon: "notebook", tone: 5,
    short: "Catatan digital estetik.",
    description: "Aplikasi catatan digital dengan fitur premium Kilonotes.",
    plans: [plan("LIFETIME", [["Garansi 6 bulan", 35]])],
  }),
  def({
    name: "Unlock Documents", category: "education", icon: "file", tone: 3,
    short: "Buka dokumen Scribd & Slideshare.",
    description: "Layanan unlock dokumen per link. Atur jumlah sesuai banyaknya link yang ingin dibuka.",
    plans: [plan("PER LINK", [["Scribd doc /link", 1.5], ["Slideshare /link", 1.5], ["Scribd book /link", 5]])],
  }),
  def({
    name: "Goodnotes 6", category: "education", icon: "notebook", tone: 6,
    short: "Catatan digital favorit pelajar.",
    description: "Catat, anotasi PDF, dan atur materi belajar dengan Goodnotes 6.",
    plans: [plan("LIFETIME", [["Garansi 6 bulan", 30]])],
  }),

  // ───────────── OTHER ─────────────
  def({
    name: "Wattpad", category: "other", icon: "book", tone: 2,
    short: "Baca cerita tanpa iklan.",
    description: "Baca cerita favorit tanpa iklan dengan Wattpad Premium.",
    plans: [plan("SHARING", [["1 bulan", 15], ["garansi 6 bulan", 35]])],
  }),
  def({
    name: "Get Contact", category: "other", icon: "phone", tone: 4,
    short: "Lihat tag & identitas penelepon.",
    description: "Fitur premium Get Contact untuk melihat tag dan identitas penelepon.",
    plans: [plan("PREMIUM", [["1 bulan", 15]])],
  }),
  def({
    name: "iLovePDF", slug: "ilovepdf", category: "other", icon: "file", tone: 1,
    short: "Olah PDF jadi gampang.",
    description: "Gabung, pisah, kompres, dan konversi PDF dengan iLovePDF Premium.",
    plans: [plan("SHARING", [["garansi 6 bulan", 20]])],
  }),

  // ───────────── GAME NEEDS ─────────────
  def({
    name: "MLBB", slug: "mlbb", category: "game", icon: "sword", tone: 6,
    short: "Starlight, WDP & teman mabar.",
    description: "Kebutuhan Mobile Legends: Bang Bang — Starlight, Weekly Diamond Pass, dan teman mabar.",
    plans: [plan("MLBB", [["Starlight Basic", 38], ["Wdp", 33], ["Temen Mabar", 0]], "Temen Mabar : free, chat admin yh slot mid")],
  }),
  def({
    name: "Genshin Impact", category: "game", icon: "gamepad", tone: 5,
    short: "Blessing of the Welkin Moon.",
    description: "Top up Blessing of the Welkin Moon untuk Genshin Impact.",
    plans: [plan("WELKIN", [["Welkin", 82]])],
  }),
];

/** "Temen Mabar" gratis — tetap bisa dipesan, harga 0 ditampilkan "Gratis". */
for (const p of products) {
  for (const pl of p.plans) for (const o of pl.options) if (o.label === "Temen Mabar") o.available = true;
  p.available = p.available ?? p.plans.some((pl) => pl.options.some((o) => o.available !== false));
}

export function getProduct(slugValue: string) {
  return products.find((p) => p.slug === slugValue);
}

export function getCategory(id: CategoryId | string) {
  return categories.find((c) => c.id === id);
}

export function productsByCategory(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export function findOption(product: Product, planId: string, optionId: string) {
  const plan = product.plans.find((p) => p.id === planId);
  const option = plan?.options.find((o) => o.id === optionId);
  return plan && option ? { plan, option } : null;
}
