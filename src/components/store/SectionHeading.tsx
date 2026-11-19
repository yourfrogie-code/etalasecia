import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="font-script text-lg text-mocha">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
