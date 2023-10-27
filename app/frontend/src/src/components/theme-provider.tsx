'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * ThemeProvider component.
 *
 * @param {React.ReactNode} children - The child components.
 * @param {ThemeProviderProps} props - The theme provider props.
 * @returns {React.ReactNode} The theme provider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps): React.ReactNode {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
