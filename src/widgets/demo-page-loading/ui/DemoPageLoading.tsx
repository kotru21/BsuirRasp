import { Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface DemoPageLoadingProps {
  /** `narrow` — abort/validation; `wide` — mock-demo */
  variant?: "narrow" | "wide";
}

export function DemoPageLoading({ variant = "narrow" }: DemoPageLoadingProps) {
  return (
    <main
      className={cn(
        "mx-auto space-y-4 p-6",
        variant === "wide" ? "max-w-3xl" : "max-w-lg"
      )}
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-7 w-3/4 max-w-sm" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton
        className={cn("w-full rounded-lg", variant === "wide" ? "min-h-[200px]" : "min-h-[120px]")}
      />
    </main>
  );
}
