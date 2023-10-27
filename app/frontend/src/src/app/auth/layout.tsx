'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import IutConnectLogo from '@/components/iutconnect-logo';
import { ModeToggle } from '@/components/theme-toggler';

/**
 * Renders the authentication layout.
 * 
 * @param children - The content to be rendered inside the layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    // Main container
    <main className="h-screen flex flex-col items-center pt-[4%]">
      {/* Card container */}
      <Card className='relative w-[448px]'>
        {/* Card header */}
        <CardHeader>
          {/* Title */}
          <IutConnectLogo className='w-72 m-auto mb-5' />
          <div className='absolute top-0 right-4 w-fit'>
            <ModeToggle open={false} />
          </div>
          {/* Navigation links */}
          <div className="flex h-5 items-center space-x-4 align-middle justify-center">
            {/* Login link */}
            <Link
              className={`w-full text-center ${
                pathname === "/auth/login" ? "underline" : ""
              }`}
              href="/auth/login"
            >
              Connexion
            </Link>
            {/* Separator */}
            <Separator orientation="vertical" />
            {/* Register link */}
            <Link
              className={`w-full text-center ${
                pathname === "/auth/register" ? "underline" : ""
              }`}
              href="/auth/register"
            >
              Inscription
            </Link>
          </div>
        </CardHeader>
        {/* Content */}
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
