'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

/**
 * ProtectedRoute component.
 *
 * @param children - The child components to be rendered.
 * @returns The protected route component.
 */
export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialized, isAuthenticated } = useAuth();
  const path = getPath();

  /**
   * Get the path segments from the current pathname.
   *
   * @returns The path segments.
   */
  function getPath(): string[] {
    return pathname.split('/').filter(Boolean);
  }

  function authorized(path: string[]): boolean {
    if (!initialized) return false;
    switch (path[0]) {
      case 'auth':
        if (isAuthenticated()) return false;
        break;

      case 'c':
        if (!isAuthenticated()) return false;
        break;

      case 's':
        if (!isAuthenticated() || (isAuthenticated() && user.role !== 'student')) return false;
        break;

      case 't':
        if (!isAuthenticated() || (isAuthenticated() && user.role !== 'tutor')) return false;
        if (path[1] && path[1] === 'admin' && !user.is_admin) return false;
        break;

      case 'e':
        if (!isAuthenticated() || (isAuthenticated() && user.role !== 'employee')) return false;
        break;

    }

    return true;
  }

  function redirect() {
    if (isAuthenticated()) {
      if (user.role === 'student')  return router.push('/s');
      if (user.role === 'tutor')    return router.push('/t');
      if (user.role === 'employee') return router.push('/e');
    } else {
      router.push('/auth/login');
    }
  }

  useEffect(() => {
    if (initialized && !authorized(path)) redirect();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialized, pathname]);

  return (
    <>
      {
        ( initialized && authorized(path) ) &&
        children
      }
    </>
  )
}
