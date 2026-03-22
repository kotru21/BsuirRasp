import { cn } from "@/shared/lib";
import type { ReactNode } from "react";

/** Верхняя зона главной: CTA и quick start в визуальном стиле developer-landing (тёмный блок). */
export function SdkProductLanding({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-white/10 bg-zinc-950 text-zinc-50",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
