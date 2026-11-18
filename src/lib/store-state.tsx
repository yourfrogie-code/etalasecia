import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findOption, getProduct } from "@/data/products";
import type { PlanOption, Product, ProductPlan } from "@/data/types";

export interface CartItem {
  slug: string;
  planId: string;
  optionId: string;
  qty: number;
}

export interface ResolvedCartItem extends CartItem {
  key: string;
  product: Product;
  plan: ProductPlan;
  option: PlanOption;
  subtotal: number;
}

const KEYS = { cart: "cia.cart.v1", wish: "cia.wishlist.v1", recent: "cia.recent.v1", note: "cia.note.v1" };
export const itemKey = (i: Pick<CartItem, "slug" | "planId" | "optionId">) => `${i.slug}|${i.planId}|${i.optionId}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Gabungkan item sama (produk+paket+durasi) dan buang yang qty ≤ 0. */
export function mergeCart(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const it of items) {
    if (it.qty <= 0) continue;
    const k = itemKey(it);
    const ex = map.get(k);
    map.set(k, ex ? { ...ex, qty: Math.min(99, ex.qty + it.qty) } : { ...it, qty: Math.min(99, it.qty) });
  }
  return [...map.values()];
}

export function resolveCart(items: CartItem[]): ResolvedCartItem[] {
  const out: ResolvedCartItem[] = [];
  for (const it of items) {
    const product = getProduct(it.slug);
    if (!product) continue;
    const found = findOption(product, it.planId, it.optionId);
    if (!found || found.option.available === false) continue;
    out.push({ ...it, key: itemKey(it), product, ...found, subtotal: found.option.price * it.qty });
  }
  return out;
}

interface StoreState {
  ready: boolean;
  cart: ResolvedCartItem[];
  cartCount: number;
  cartTotal: number;
  note: string;
  setNote: (n: string) => void;
  addToCart: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  changeVariant: (key: string, planId: string, optionId: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => boolean;
  isWished: (slug: string) => boolean;
  recent: string[];
  pushRecent: (slug: string) => void;
}

const Ctx = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    setItems(read(KEYS.cart, []));
    setWishlist(read(KEYS.wish, []));
    setRecent(read(KEYS.recent, []));
    setNote(read(KEYS.note, ""));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) localStorage.setItem(KEYS.cart, JSON.stringify(items)); }, [items, ready]);
  useEffect(() => { if (ready) localStorage.setItem(KEYS.wish, JSON.stringify(wishlist)); }, [wishlist, ready]);
  useEffect(() => { if (ready) localStorage.setItem(KEYS.recent, JSON.stringify(recent)); }, [recent, ready]);
  useEffect(() => { if (ready) localStorage.setItem(KEYS.note, JSON.stringify(note)); }, [note, ready]);

  const cart = useMemo(() => resolveCart(items), [items]);

  const addToCart = useCallback((item: CartItem) => setItems((prev) => mergeCart([...prev, item])), []);
  const setQty = useCallback(
    (key: string, qty: number) =>
      setItems((prev) => mergeCart(prev.map((i) => (itemKey(i) === key ? { ...i, qty: Math.max(0, Math.min(99, qty)) } : i)))),
    [],
  );
  const changeVariant = useCallback(
    (key: string, planId: string, optionId: string) =>
      setItems((prev) => mergeCart(prev.map((i) => (itemKey(i) === key ? { ...i, planId, optionId } : i)))),
    [],
  );
  const removeItem = useCallback((key: string) => setItems((prev) => prev.filter((i) => itemKey(i) !== key)), []);
  const clearCart = useCallback(() => { setItems([]); setNote(""); }, []);

  const toggleWish = useCallback(
    (slug: string) => {
      const added = !wishlist.includes(slug);
      setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev]));
      return added;
    },
    [wishlist],
  );

  const pushRecent = useCallback(
    (slug: string) => setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 10)),
    [],
  );

  const value: StoreState = {
    ready,
    cart,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    cartTotal: cart.reduce((s, i) => s + i.subtotal, 0),
    note,
    setNote,
    addToCart,
    setQty,
    changeVariant,
    removeItem,
    clearCart,
    wishlist,
    toggleWish,
    isWished: (slug) => wishlist.includes(slug),
    recent,
    pushRecent,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
