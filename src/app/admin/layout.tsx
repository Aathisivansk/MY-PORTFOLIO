"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated] = useLocalStorage('is-authenticated', false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, router, isMounted, pathname]);

  if (!isMounted) {
    return null; // Don't render anything on the server or during initial client render
  }
  
  if (!isAuthenticated && pathname !== '/admin') {
    return null; 
  }

  if (isAuthenticated && pathname === '/admin') {
    router.push('/admin/dashboard');
    return null;
  }

  return <>{children}</>;
}
