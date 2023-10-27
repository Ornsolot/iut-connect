'use client'

import { useTheme } from 'next-themes';
import React, { CSSProperties } from 'react'

export default function IutConnectLogo({ className, style } : { className?: string, style?: CSSProperties }) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      {
        theme === "dark" ?
        <img className={`transition-[padding] duration-300 ${className}`} src="/logo-light.svg" alt="logo iut-connect" style={style} />:
        <img className={`transition-[padding] duration-300 ${className}`} src="/logo.svg" alt="logo iut-connect" style={style} />
      }
    </div>
  )
}
