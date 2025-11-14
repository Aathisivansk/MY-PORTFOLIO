
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';
import AdminLoginPage from './page';

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
      if (isAuthenticated && pathname === '/admin') {
        router.push('/admin/dashboard');
      } else if (!isAuthenticated && pathname !== '/admin') {
        router.push('/admin');
      }
    }
  }, [isMounted, isAuthenticated, pathname, router]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return <>{children}</>;
}
