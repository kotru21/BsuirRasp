"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/shared/ui";
import type { StudentGroup } from "@/entities/student-group";
import { SearchIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const MAX_SUGGESTIONS = 10;

interface GroupSelectProps {
  groups: StudentGroup[];
  placeholder?: string;
  className?: string;
}

function matchGroup(query: string, group: StudentGroup): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    group.name.toLowerCase().includes(q) ||
    (group.specialityName?.toLowerCase().includes(q) ?? false)
  );
}

export function GroupSelect({
  groups,
  placeholder = "Введите номер группы...",
  className,
}: GroupSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupFromUrl = searchParams.get("group") ?? "";

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(groupFromUrl);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(groupFromUrl);
  }, [groupFromUrl]);

  const filtered = useMemo(() => {
    return groups.filter((g) => matchGroup(inputValue, g)).slice(0, MAX_SUGGESTIONS);
  }, [groups, inputValue]);

  const selectGroup = useCallback(
    (group: StudentGroup) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("group", group.name);
      router.push(`?${next.toString()}`, { scroll: false });
      setInputValue(group.name);
      setOpen(false);
      setHighlightedIndex(0);
    },
    [router, searchParams]
  );

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || filtered.length === 0) {
        if (e.key === "Escape") setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectGroup(filtered[highlightedIndex]);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [open, filtered, highlightedIndex, selectGroup]
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [inputValue]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const item = el.querySelector(`[data-index="${highlightedIndex}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={cn("relative w-[200px] sm:w-[280px]", className)}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-9 pl-9 pr-3"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="group-suggestions"
          aria-activedescendant={
            open && filtered[highlightedIndex]
              ? `group-option-${filtered[highlightedIndex].id}`
              : undefined
          }
          role="combobox"
        />
      </div>

      {open && (
        <div
          id="group-suggestions"
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[280px] overflow-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {inputValue.trim() ? "Группы не найдены" : "Введите номер группы"}
            </div>
          ) : (
            filtered.map((g, i) => (
              <button
                key={g.id}
                type="button"
                id={`group-option-${g.id}`}
                role="option"
                data-index={i}
                aria-selected={i === highlightedIndex}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm outline-none transition-colors",
                  i === highlightedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted/80"
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectGroup(g);
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <span className="font-medium">{g.name}</span>
                {g.specialityName && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {g.specialityName}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
