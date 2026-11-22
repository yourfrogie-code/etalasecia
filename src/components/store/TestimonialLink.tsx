import type { ReactNode } from "react";
import { toast } from "sonner";
import { store } from "@/config/store";
import { isExternalLinkReady } from "@/lib/whatsapp";

/** Membuka tautan testimoni eksternal di tab baru. */
export function TestimonialLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ready = isExternalLinkReady(store.testimonialUrl);
  return (
    <a
      href={ready ? store.testimonialUrl : "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => {
        if (!ready) {
          e.preventDefault();
          toast("Link testimoni belum dipasang", {
            description: "Isi testimonialUrl di pengaturan toko dengan link testimoni kamu.",
          });
        }
      }}
    >
      {children}
    </a>
  );
}
