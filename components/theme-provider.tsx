"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * App-wide theme provider — thin next-themes wrapper.
 *
 * Dark by default, class-based (next-themes adds `.dark` / `.light` to <html>,
 * which `app/globals.css` keys its tokens off), no system sync, and transitions
 * disabled on theme change so the circular-reveal wipe owns the animation.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
