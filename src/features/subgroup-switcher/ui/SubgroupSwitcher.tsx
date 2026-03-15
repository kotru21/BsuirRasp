"use client";

import { cn } from "@/shared/lib/utils";
import type { SubgroupFilter } from "@/entities/schedule";

interface SubgroupSwitcherProps {
  subgroupFilter: SubgroupFilter;
  setSubgroupFilter: (value: SubgroupFilter) => void;
  className?: string;
}

const OPTIONS: { value: SubgroupFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: 1, label: "1 подгр." },
  { value: 2, label: "2 подгр." },
];

export function SubgroupSwitcher({
  subgroupFilter,
  setSubgroupFilter,
  className,
}: SubgroupSwitcherProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {OPTIONS.map((opt) => {
        const isActive = subgroupFilter === opt.value;
        return (
          <button
            key={String(opt.value)}
            onClick={() => setSubgroupFilter(opt.value)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
