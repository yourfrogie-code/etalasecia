import { Link } from "@tanstack/react-router";
import { Instagram, Music2 } from "lucide-react";
import { store } from "@/config/store";
import { chatAdminUrl } from "@/lib/whatsapp";
import { TestimonialLink } from "@/components/store/TestimonialLink";
import { WhatsappIcon } from "./FloatingActions";

export function Footer() {
  return (
    <footer className="relative mt-20 bg-deep text-deep-foreground">
      <div className="scallop-top absolute inset-x-0 -top-4 h-5 bg-deep" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={store.logo}
              alt={`Logo ${store.name}`}
              className="h-14 w-14 rounded-full border-2 border-matcha bg-matcha object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">{store.name}</p>
              <p className="font-script text-matcha">since {store.since}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm opacity-80">
            Toko aplikasi premium yang sudah ada sejak {store.since}. Melayani akun streaming,
            musik, editing, AI, edukasi, dan kebutuhan game dengan harga bersahabat.
          </p>
        </div>
        <div>
          <p className="mb-3 font-display font-bold text-matcha">Navigasi</p>
          <ul className="space-y-2 text-sm opacity-90">
            <li>
              <Link to="/" className="hover:text-matcha">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/katalog" className="hover:text-matcha">
                Katalog
              </Link>
            </li>
            <li>
              <Link to="/kategori" className="hover:text-matcha">
                Kategori
              </Link>
            </li>
            <li>
              <Link to="/favorit" className="hover:text-matcha">
                Favorit
              </Link>
            </li>
            <li>
              <Link to="/keranjang" className="hover:text-matcha">
                Keranjang
              </Link>
            </li>
            <li>
              <TestimonialLink className="hover:text-matcha">Testimoni</TestimonialLink>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display font-bold text-matcha">Kontak & Sosial</p>
          <a
            href={chatAdminUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-display text-sm font-bold text-whatsapp-foreground"
          >
            <WhatsappIcon className="h-4 w-4" /> {store.whatsappNumber}
          </a>
          <div className="flex gap-2">
            {store.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border-2 border-matcha/50 hover:bg-matcha hover:text-deep"
              >
                {s.label === "Instagram" ? (
                  <Instagram className="h-4 w-4" />
                ) : (
                  <Music2 className="h-4 w-4" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-matcha/20 py-4 pb-28 text-center text-xs opacity-70 md:pb-4">
        © {new Date().getFullYear()} {store.name}. Dibuat dengan 💚 sejak {store.since}.
      </div>
    </footer>
  );
}
