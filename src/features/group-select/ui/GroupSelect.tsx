"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Input, Skeleton } from "@/shared/ui";
import type { Employee, StudentGroup } from "@/entities";
import { SearchIcon } from "lucide-react";
import { cn, getUrlSearchParamsForNavigation } from "@/shared/lib";

const MAX_SUGGESTIONS = 10;

interface GroupSelectProps {
  groups: StudentGroup[];
  employees: Employee[];
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

function matchEmployee(query: string, employee: Employee): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    employee.fio.toLowerCase().includes(q) ||
    employee.urlId.toLowerCase().includes(q)
  );
}

type SearchItem =
  | {
      kind: "group";
      key: string;
      id: string;
      title: string;
      subtitle?: string;
      group: StudentGroup;
    }
  | {
      kind: "employee";
      key: string;
      id: string;
      title: string;
      subtitle?: string;
      employee: Employee;
    };

export function GroupSelect({
  groups,
  employees,
  placeholder = "Введите номер группы...",
  className,
}: GroupSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupFromUrl = searchParams.get("group") ?? "";
  const employeeFromUrl = searchParams.get("employee") ?? "";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.urlId === employeeFromUrl),
    [employees, employeeFromUrl]
  );
  const selectedValue = groupFromUrl || selectedEmployee?.fio || employeeFromUrl || "";
  const inputValue = isEditing ? query : selectedValue;

  const filtered = useMemo<SearchItem[]>(() => {
    const matchedGroups = groups
      .filter((g) => matchGroup(inputValue, g))
      .map<SearchItem>((g) => ({
        kind: "group",
        key: `group-${g.id}`,
        id: `group-option-${g.id}`,
        title: g.name,
        subtitle: g.specialityName,
        group: g,
      }));

    const matchedEmployees = employees
      .filter((e) => matchEmployee(inputValue, e))
      .map<SearchItem>((e) => ({
        kind: "employee",
        key: `employee-${e.id}`,
        id: `employee-option-${e.id}`,
        title: e.fio,
        subtitle: e.rank || e.degree ? [e.rank, e.degree].filter(Boolean).join(", ") : undefined,
        employee: e,
      }));

    return [...matchedGroups, ...matchedEmployees].slice(0, MAX_SUGGESTIONS);
  }, [groups, employees, inputValue]);
  const safeHighlightedIndex = useMemo(() => {
    if (filtered.length === 0) return 0;
    return Math.min(highlightedIndex, filtered.length - 1);
  }, [filtered.length, highlightedIndex]);

  const selectGroup = useCallback(
    (group: StudentGroup) => {
      if (isPending) return;
      const next = getUrlSearchParamsForNavigation();
      next.set("group", group.name);
      next.delete("employee");
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: false });
      });
      setQuery(group.name);
      setIsEditing(false);
      setOpen(false);
      setHighlightedIndex(0);
    },
    [isPending, router, startTransition]
  );

  const selectEmployee = useCallback(
    (employee: Employee) => {
      if (isPending) return;
      const next = getUrlSearchParamsForNavigation();
      next.set("employee", employee.urlId);
      next.delete("group");
      startTransition(() => {
        router.push(`?${next.toString()}`, { scroll: false });
      });
      setQuery(employee.fio);
      setIsEditing(false);
      setOpen(false);
      setHighlightedIndex(0);
    },
    [isPending, router, startTransition]
  );

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setIsEditing(false);
    }, 150);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setQuery(selectedValue);
    setIsEditing(true);
    setHighlightedIndex(0);
    setOpen(true);
  }, [selectedValue]);

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
        if (isPending) return;
        const selected = filtered[safeHighlightedIndex];
        if (!selected) return;
        if (selected.kind === "group") {
          selectGroup(selected.group);
        } else {
          selectEmployee(selected.employee);
        }
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [isPending, open, filtered, safeHighlightedIndex, selectGroup, selectEmployee]
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const item = el.querySelector(`[data-index="${safeHighlightedIndex}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, [safeHighlightedIndex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-w-0 sm:min-w-48 sm:max-w-md lg:max-w-lg",
        className
      )}
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder={placeholder}
          disabled={isPending}
          value={inputValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
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
            open && filtered[safeHighlightedIndex]
              ? filtered[safeHighlightedIndex].id
              : undefined
          }
          role="combobox"
        />
        {isPending && (
          <div className="pointer-events-none absolute inset-y-1.5 right-2 flex items-center">
            <Skeleton className="h-6 w-12 rounded-sm" />
          </div>
        )}
      </div>

      {open && (
        <div
          id="group-suggestions"
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[280px] overflow-auto rounded-lg border bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95"
        >
          {isPending ? (
            <div className="space-y-2 px-3 py-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              {inputValue.trim()
                ? "Ничего не найдено"
                : "Введите номер группы или ФИО преподавателя"}
            </div>
          ) : (
            filtered.map((g, i) => (
              <button
                key={g.key}
                type="button"
                id={g.id}
                role="option"
                data-index={i}
                aria-selected={i === safeHighlightedIndex}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm outline-none transition-colors",
                  i === safeHighlightedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/80"
                )}
                onMouseDown={(e) => {
                  if (isPending) return;
                  e.preventDefault();
                  if (g.kind === "group") {
                    selectGroup(g.group);
                  } else {
                    selectEmployee(g.employee);
                  }
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
                disabled={isPending}
              >
                <span className="font-medium">{g.title}</span>
                {g.subtitle && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {g.subtitle}
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
