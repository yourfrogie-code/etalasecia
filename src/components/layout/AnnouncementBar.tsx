import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { store } from "@/config/store";

export function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("cia.ann") === "0") setHidden(true);
  }, []);
  if (hidden) return null;
  const items = [...store.announcement, ...store.announcement];
  return (
    <div className="relative overflow-hidden bg-deep text-deep-foreground">
      <div className="flex w-max animate-marquee gap-10 py-2 pr-10 font-display text-xs font-medium sm:text-sm">
        {items.map((t, i) => (
          <span key={i} className="whitespace-nowrap">
            ✦ {t}
          </span>
        ))}
      </div>
      <button
        type="button"
        aria-label="Tutup pengumuman"
        onClick={() => {
          sessionStorage.setItem("cia.ann", "0");
          setHidden(true);
        }}
        className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-deep hover:bg-card/20"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
