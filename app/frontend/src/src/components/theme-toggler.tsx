"use client"

import React, { useEffect } from "react"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Component for toggling the theme mode.
 */
export function ModeToggle({ open }:{ open: boolean }) {
  const { theme, setTheme } = useTheme();

  const [data, setData] = React.useState({
    theme: theme,
    icon: theme === 'light' ? <Sun /> : <Moon />,
  })

  useEffect(() => {
    switch (theme) {
      case 'light':
        setData({
          theme: 'Clair',
          icon: <Sun className="h-[1.2rem] w-[1.2rem]" />,
        })
        break;
      case 'dark':
        setData({
          theme: 'Sombre',
          icon: <Moon className="h-[1.2rem] w-[1.2rem]" />,
        })
        break;
      case 'system':
        setData({
          theme: 'Système',
          icon: <SunMoon className="h-[1.2rem] w-[1.2rem]" />,
        })
        break;
    }
  }, [theme])

  return (
    // Dropdown menu for theme options
    <DropdownMenu>
      {/* Trigger button */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="font-bold w-full flex justify-center text-gray-500">
          { data.icon }
          { open && <p className="capitalize ml-2">{data.theme}</p> }
        </Button>
      </DropdownMenuTrigger>
      {/* Content of the dropdown menu */}
      <DropdownMenuContent align="end">
        {/* Light theme option */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Clair
        </DropdownMenuItem>
        {/* Dark theme option */}
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Sombre
        </DropdownMenuItem>
        {/* System theme option */}
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
