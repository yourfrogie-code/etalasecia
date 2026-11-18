import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Moon, Search, ShoppingBag, Sun } from "lucide-react";
import { store } from "@/config/store";
import { useStore } from "@/lib/store-state";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/store/SearchDialog";
import { TestimonialLink } from "@/components/store/TestimonialLink";

const linkCls = "rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors hover:bg-secondary";
const activeCls = "bg-ink text-ink-foreground hover:bg-ink";

export function IconBtn({ label, onClick, children, className }: { label: string; onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn("relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-card transition-transform hover:-translate-y-0.5 active:translate-y-0", className)}
    >
      {children}
    </button>
  );
}

export function CartBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-blush px-1 text-[10px] font-bold text-blush-foreground animate-pop" key={count}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist } = useStore();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 md:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img src={store.logo} alt={`Logo ${store.name}`} className="h-11 w-11 shrink-0 rounded-full border-2 border-ink bg-secondary object-cover" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold leading-none">{store.name}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{store.handle}</span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Navigasi utama">
          <Link to="/" className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>Beranda</Link>
          <Link to="/katalog" className={linkCls} activeProps={{ className: activeCls }}>Katalog</Link>
          <Link to="/kategori" className={linkCls} activeProps={{ className: activeCls }}>Kategori</Link>
          <TestimonialLink className={linkCls}>Testimoni</TestimonialLink>
        </nav>

        <div className="flex items-center gap-2">
          <IconBtn label="Cari produk" onClick={() => setSearchOpen(true)}><Search className="h-4 w-4" /></IconBtn>
          <Link to="/favorit" aria-label="Favorit" className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-card transition-transform hover:-translate-y-0.5">
            <Heart className="h-4 w-4" />
            <CartBadge count={wishlist.length} />
          </Link>
          <IconBtn label={theme === "dark" ? "Mode terang" : "Mode gelap"} onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </IconBtn>
          <Link to="/keranjang" aria-label="Keranjang" className="relative hidden h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 md:grid">
            <ShoppingBag className="h-4 w-4" />
            <CartBadge count={cartCount} />
          </Link>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
