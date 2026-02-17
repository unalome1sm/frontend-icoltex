'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getApiUrl, getAuthHeaders } from '@/lib/api';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState<{ email: string; nombre?: string } | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      return;
    }
    const token = localStorage.getItem('icoltex_token');
    if (!token) {
      router.replace('/admin/login');
      setChecking(false);
      return;
    }
    fetch(getApiUrl('/api/auth/me'), {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('icoltex_token');
          router.replace('/admin/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.admin) {
          setAdmin(data.admin);
        } else if (data?.user) {
          router.replace('/account');
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        router.replace('/admin/login');
      })
      .finally(() => {
        setChecking(false);
      });
  }, [router, pathname]);

  async function handleLogout() {
    try {
      await fetch(getApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    }
    localStorage.removeItem('icoltex_token');
    router.replace('/admin/login');
    router.refresh();
  }

  if (pathname === '/admin/login') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4">
        {children}
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Verificando sesión...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar onLogout={handleLogout} adminEmail={admin.email} />
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
