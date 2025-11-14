"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/use-local-storage';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated] = useLocalStorage('is-authenticated', false);
  const router = useRouter();

  useEffect(() => {
    // We check if window is defined to ensure this runs only on the client
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);
  
  // While checking or if not authenticated, we can show a loader or nothing
  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}
