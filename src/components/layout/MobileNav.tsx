import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, MessageCircleHeart, ShoppingBag, Store } from "lucide-react";
import { useStore } from "@/lib/store-state";
import { TestimonialLink } from "@/components/store/TestimonialLink";
import { CartBadge } from "./Navbar";

const item = "flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-[11px] font-bold font-display text-muted-foreground transition-colors";
const active = "bg-primary text-primary-foreground";

export function MobileNav() {
  const { cartCount } = useStore();
  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-3 bottom-3 z-40 flex gap-1 rounded-3xl border-2 border-ink bg-card/95 p-1.5 shadow-sticker backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <Link to="/" className={item} activeProps={{ className: active }} activeOptions={{ exact: true }}><Home className="h-5 w-5" />Beranda</Link>
      <Link to="/katalog" className={item} activeProps={{ className: active }}><Store className="h-5 w-5" />Katalog</Link>
      <Link to="/kategori" className={item} activeProps={{ className: active }}><LayoutGrid className="h-5 w-5" />Kategori</Link>
      <TestimonialLink className={item}><MessageCircleHeart className="h-5 w-5" />Testimoni</TestimonialLink>
      <Link to="/keranjang" className={item} activeProps={{ className: active }}>
        <span className="relative"><ShoppingBag className="h-5 w-5" /><CartBadge count={cartCount} /></span>
        Keranjang
      </Link>
    </nav>
  );
}
