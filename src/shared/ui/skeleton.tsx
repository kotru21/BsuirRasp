import * as React from "react";
import { cn } from "@/shared/lib";

interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Светлые полоски на тёмном фоне (напр. лендинг в dark). */
  onDark?: boolean;
}

function Skeleton({ className, onDark, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-md",
        onDark ? "bg-white/10" : "bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
