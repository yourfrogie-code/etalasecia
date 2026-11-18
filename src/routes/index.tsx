import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Clock, MessageCircleHeart, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { store } from "@/config/store";
import { categories, getProduct, products } from "@/data/products";
import { formatRupiah } from "@/lib/format";
import { chatAdminUrl } from "@/lib/whatsapp";
import { perDayPrice } from "@/lib/pricing";
import { ProductCard } from "@/components/store/ProductCard";
import { CategoryHighlights } from "@/components/store/CategoryHighlights";
import { SectionHeading } from "@/components/store/SectionHeading";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";
import { TestimonialLink } from "@/components/store/TestimonialLink";
import { WhatsappIcon } from "@/components/layout/FloatingActions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cia Store — Aplikasi Premium Murah & Bergaransi" },
      { name: "description", content: "Netflix, Spotify, Canva, CapCut, ChatGPT & banyak lagi. Pilih paket, ketuk, pesan langsung via WhatsApp di Cia Store." },
      { property: "og:title", content: "Cia Store — Aplikasi Premium Murah & Bergaransi" },
      { property: "og:description", content: "Pilih aplikasi premium favoritmu dan pesan langsung via WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const infoIcons = { clock: Clock, shield: ShieldCheck, wallet: Wallet } as const;

function Hero() {
  const h = store.hero;
  return (
    <section className="relative overflow-hidden bg-checker">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1fr_1.15fr] md:pb-24 md:pt-16">
        <div className="relative z-10 animate-rise">
          <p className="font-script text-xl text-mocha sm:text-2xl">{h.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            {h.title.split(store.name)[0]}
            <span className="relative inline-block">
              <span className="relative z-10">{store.name}</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded-full bg-matcha" />
            </span>
            {h.title.split(store.name)[1]}
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">{h.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="sticker" size="lg">
              <Link to="/katalog">{h.primaryCta} <ArrowRight /></Link>
            </Button>
            <Button asChild variant="outlineInk" size="lg">
              <a href={chatAdminUrl()} target="_blank" rel="noopener noreferrer"><WhatsappIcon className="h-5 w-5" /> {h.secondaryCta}</a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="tag-sticker">cute</span>
            <span className="rounded-lg bg-mocha px-2.5 py-1 font-display text-mocha-foreground">love</span>
            <span className="rounded-lg border-2 border-ink bg-card px-2.5 py-0.5 font-display">since {store.since}</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative rotate-2 rounded-[2rem] border-2 border-ink bg-card p-2.5 shadow-sticker transition-transform duration-500 hover:rotate-0">
            <img
              src={store.headerImage}
              alt={`Banner ${store.name}`}
              className="aspect-[16/10] w-full rounded-[1.5rem] object-cover"
              fetchPriority="high"
            />
            <div className="flex items-center justify-between px-2 pb-1 pt-3">
              <span className="font-script text-lg text-mocha">photobooth ✿</span>
              <span className="font-display text-xs font-bold text-muted-foreground">#{store.handle.replace("@", "")}</span>
            </div>
          </div>
          <img src={store.logo} alt="" aria-hidden className="absolute -bottom-8 -left-4 h-24 w-24 animate-float drop-shadow-xl sm:h-32 sm:w-32" />
          <span aria-hidden className="absolute -right-2 -top-4 tag-sticker rotate-6 text-sm">?!</span>
          <span aria-hidden className="absolute -top-6 left-10 animate-spin-slow font-display text-3xl text-sage">✦</span>
        </div>
      </div>
      <div className="scallop-bottom absolute inset-x-0 bottom-0 h-6 bg-background" style={{ transform: "rotate(180deg)" }} aria-hidden />
    </section>
  );
}

function Profile() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-[2rem] border-2 border-ink bg-card p-5 shadow-sticker-sm sm:p-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 sm:gap-8">
          <div className="story-ring rounded-full p-1">
            <img src={store.logo} alt={`Logo ${store.name}`} className="h-24 w-24 rounded-full border-4 border-card bg-secondary object-cover sm:h-36 sm:w-36" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-display text-2xl font-bold sm:text-3xl">{store.name}</h2>
              <BadgeCheck className="h-6 w-6 shrink-0 fill-matcha text-ink" aria-label="Terverifikasi" />
            </div>
            <p className="text-sm text-muted-foreground">{store.handle}</p>
            <dl className="mt-3 grid max-w-sm grid-cols-3 gap-2 text-center">
              {[
                { v: String(store.since), l: "sejak" },
                { v: String(products.length), l: "aplikasi" },
                { v: String(categories.length), l: "kategori" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-secondary px-1 py-2">
                  <dt className="sr-only">{s.l}</dt>
                  <dd className="font-display text-lg font-bold leading-none sm:text-xl">{s.v}</dd>
                  <dd className="text-[11px] text-muted-foreground">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-5 text-sm sm:text-base">{store.profile.bio}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {store.profile.info.map((i) => {
            const Icon = infoIcons[i.icon];
            return (
              <div key={i.label} className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border px-3 py-2.5">
                <Icon className="h-5 w-5 shrink-0 text-mocha" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">{i.label}</p>
                  <p className="truncate text-sm font-bold">{i.value}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button asChild variant="whatsapp" className="h-11">
            <a href={chatAdminUrl()} target="_blank" rel="noopener noreferrer"><WhatsappIcon className="h-4 w-4" /> WhatsApp</a>
          </Button>
          <Button asChild variant="sticker" className="h-11">
            <Link to="/katalog">Lihat Katalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  const netflix = getProduct("netflix");
  const plan = netflix?.plans[0];
  const short = plan?.options[0];
  const long = plan?.options.find((o) => o.label === "3 bulan");
  const shortDay = short ? perDayPrice(short) : null;
  const longDay = long ? perDayPrice(long) : null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="ticket-edge relative overflow-hidden rounded-[2rem] bg-ink p-6 text-ink-foreground sm:p-10">
        <div aria-hidden className="bg-grain absolute inset-0 opacity-40" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-matcha px-3 py-1 font-display text-xs font-bold text-ink"><Sparkles className="h-3 w-3" /> Tips Hemat</span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Makin lama, makin <span className="text-matcha">hemat!</span>
            </h2>
            <p className="mt-2 max-w-md text-sm opacity-80 sm:text-base">
              Ambil durasi lebih panjang supaya harga per harinya jauh lebih murah. Cari label <b className="text-matcha">“hemat %”</b> di setiap pilihan paket.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="sticker"><Link to="/katalog" search={{ promo: true }}>Lihat Produk Promo</Link></Button>
              <Button asChild variant="outlineInk" className="border-matcha bg-transparent text-ink-foreground hover:bg-matcha/20">
                <Link to="/produk/$slug" params={{ slug: "netflix" }}>Cek Netflix</Link>
              </Button>
            </div>
          </div>
          {shortDay && longDay && (
            <div className="grid grid-cols-2 gap-3 font-display">
              <div className="rounded-3xl border-2 border-dashed border-matcha/40 p-4">
                <p className="text-xs opacity-70">Netflix 1 hari</p>
                <p className="text-2xl font-bold">{formatRupiah(shortDay)}</p>
                <p className="text-xs opacity-70">per hari</p>
              </div>
              <div className="rotate-2 rounded-3xl border-2 border-ink bg-matcha p-4 text-ink shadow-sticker">
                <p className="text-xs">Netflix 3 bulan</p>
                <p className="text-2xl font-bold">{formatRupiah(Math.ceil(longDay))}</p>
                <p className="text-xs">per hari ✿</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const featured = products.filter((p) => p.popular);
  return (
    <>
      <Hero />
      <Profile />

      <section className="mx-auto max-w-6xl px-4 py-6">
        <SectionHeading eyebrow="highlights" title="Pilih kategori" className="md:text-center md:[&>div]:col-span-2" />
        <CategoryHighlights />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionHeading
          eyebrow="paling dicari"
          title="Produk unggulan"
          action={
            <Link to="/katalog" className="inline-flex items-center gap-1 font-display text-sm font-bold hover:underline">
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </section>

      <PromoBanner />
      <RecentlyViewed />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <TestimonialLink className="group relative block overflow-hidden rounded-[2rem] border-2 border-ink bg-blush p-8 text-center text-blush-foreground shadow-sticker transition-transform hover:-translate-y-1 sm:p-12">
          <span aria-hidden className="absolute left-6 top-4 font-display text-4xl opacity-40">♡</span>
          <span aria-hidden className="absolute bottom-4 right-8 font-display text-3xl opacity-40">✦</span>
          <MessageCircleHeart className="mx-auto h-10 w-10 animate-wiggle" />
          <p className="mt-2 font-script text-xl">kata mereka tentang kami</p>
          <p className="font-display text-4xl font-bold tracking-wide sm:text-6xl">TESTIMONI</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-5 py-2.5 font-display text-sm font-bold text-foreground">
            Lihat testimoni <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </TestimonialLink>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <SectionHeading eyebrow="ada pertanyaan?" title="FAQ" />
        <Accordion type="single" collapsible className="space-y-3">
          {store.faq.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="overflow-hidden rounded-2xl border-2 border-ink bg-card px-4 data-[state=open]:bg-secondary">
              <AccordionTrigger className="font-display text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
