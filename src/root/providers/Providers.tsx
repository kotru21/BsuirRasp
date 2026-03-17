"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "../theme/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
