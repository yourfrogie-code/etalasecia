import { useEffect, useState } from "react";
import { store } from "@/config/store";
import { cn } from "@/lib/utils";

/** Animasi pembuka singkat sekali per sesi. */
export function SplashLoader() {
  const [state, setState] = useState<"show" | "fade" | "gone">("show");
  useEffect(() => {
    if (sessionStorage.getItem("cia.splash")) { setState("gone"); return; }
    sessionStorage.setItem("cia.splash", "1");
    const a = setTimeout(() => setState("fade"), 900);
    const b = setTimeout(() => setState("gone"), 1400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (state === "gone") return null;
  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center bg-checker transition-opacity duration-500",
        state === "fade" && "pointer-events-none opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <img src={store.logo} alt="" className="h-32 w-32 animate-float rounded-full border-2 border-ink bg-card object-cover shadow-sticker" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2.5 w-2.5 animate-bounce rounded-full bg-ink" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <p className="tag-sticker text-sm">memuat {store.name}…</p>
      </div>
    </div>
  );
}
