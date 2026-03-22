"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shared/ui";
import { THEME_LABELS } from "@/shared/config";
import type { ThemeValue } from "@/shared/config";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/shared/lib";

const THEME_OPTIONS: ThemeValue[] = ["light", "dark", "system"];

const ThemeIcon = ({ theme }: { theme: string }) => {
  if (theme === "light") return <SunIcon className="size-4" />;
  if (theme === "dark") return <MoonIcon className="size-4" />;
  return <MonitorIcon className="size-4" />;
};

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Placeholder до монтирования, чтобы сервер и первый клиентский рендер совпадали (гидрация next-themes).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: avoid hydration mismatch with theme-dependent UI
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as ThemeValue;
  const displayTheme = resolvedTheme ?? "light";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-9", className)}
        aria-label="Выбрать тему"
      >
        <SunIcon className="size-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        aria-label="Выбрать тему"
      >
        <ThemeIcon theme={displayTheme} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={(value) => setTheme(value as ThemeValue)}
        >
          {THEME_OPTIONS.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <ThemeIcon theme={value === "system" ? "system" : value} />
              <span className="ml-2">{THEME_LABELS[value]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
