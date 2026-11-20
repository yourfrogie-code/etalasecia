import { store } from "@/config/store";

export function AnnouncementBar() {
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
    </div>
  );
}
