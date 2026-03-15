"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SubgroupFilter } from "@/entities/schedule";

const VALID = new Set<string>(["", "1", "2"]);

export function useSubgroup(): {
  subgroupFilter: SubgroupFilter;
  setSubgroupFilter: (value: SubgroupFilter) => void;
} {
  const router = useRouter();
  const searchParams = useSearchParams();

  const param = searchParams.get("subgroup") ?? "";
  const subgroupFilter: SubgroupFilter = VALID.has(param)
    ? (param === "" ? "all" : (Number(param) as 1 | 2))
    : "all";

  function setSubgroupFilter(value: SubgroupFilter) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      next.delete("subgroup");
    } else {
      next.set("subgroup", String(value));
    }
    router.push(`?${next.toString()}`, { scroll: false });
  }

  return { subgroupFilter, setSubgroupFilter };
}
