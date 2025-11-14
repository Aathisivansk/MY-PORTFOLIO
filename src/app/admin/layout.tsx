"use client";

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated] = useLocalStorage('is-authenticated', false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated && pathname !== '/admin') {
        router.push('/admin');
      } else if (isAuthenticated && pathname === '/admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [isMounted, isAuthenticated, pathname, router]);

  if (!isMounted) {
    return null; // Prevent server-side rendering of protected content
  }

  // Render children only if authenticated or on the login page itself
  if (isAuthenticated || pathname === '/admin') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing while redirecting
  return null;
}
