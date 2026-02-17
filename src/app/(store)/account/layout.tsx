'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl, getAuthHeaders } from '@/lib/api';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<{ email: string; nombre?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('icoltex_token');
    if (!token) {
      router.replace('/login');
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
          router.replace('/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.admin) {
          router.replace('/admin');
          return;
        }
        if (data?.user) {
          setUser(data.user);
        } else {
          router.replace('/login');
        }
      })
      .catch(() => {
        router.replace('/login');
      })
      .finally(() => {
        setChecking(false);
      });
  }, [router]);

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
    router.replace('/login');
    router.refresh();
  }

  if (checking) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Mi cuenta</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <nav className="flex flex-wrap items-center gap-4">
          <Link
            href="/account"
            className={`text-sm ${pathname === '/account' ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Inicio
          </Link>
          <Link
            href="/account/profile"
            className={`text-sm ${pathname === '/account/profile' ? 'font-medium text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mi perfil
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Ir a la tienda
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}
