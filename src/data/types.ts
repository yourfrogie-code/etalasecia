export type CategoryId = "entertainment" | "music" | "editing" | "ai" | "education" | "other" | "game";

export type IconName =
  | "clapperboard" | "tv" | "film" | "popcorn" | "drama" | "music" | "headphones" | "disc"
  | "scissors" | "palette" | "sparkles" | "camera" | "wand" | "bot" | "brain" | "languages"
  | "pen" | "file" | "notebook" | "book" | "phone" | "gamepad" | "sword" | "star" | "heart";

export interface PlanOption {
  id: string;
  label: string;
  /** Harga dalam Rupiah penuh. 0 = gratis. */
  price: number;
  available?: boolean;
}

export interface ProductPlan {
  id: string;
  name: string;
  note?: string;
  options: PlanOption[];
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  short: string;
  description: string;
  /** Keterangan dari penjual (ditampilkan apa adanya). */
  note?: string;
  plans: ProductPlan[];
  icon: IconName;
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  /** Opsional: URL gambar produk sendiri. Jika kosong, dipakai ilustrasi kartu. */
  image?: string;
  popular?: boolean;
  promo?: boolean;
  available?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  icon: IconName;
  blurb: string;
}
