'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, RefreshCw, Users, Shield, Store, LogOut, Images } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
  { href: '/admin/galleries', label: 'Galerías por línea', icon: Images },
  { href: '/admin/sync', label: 'Sincronizar', icon: RefreshCw },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/admins', label: 'Administradores', icon: Shield },
];

export function DashboardSidebar({
  onLogout,
  adminEmail,
}: {
  onLogout: () => void;
  adminEmail?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center border-b border-slate-200 px-4">
        <Link href="/admin" className="text-lg font-semibold text-slate-900">
          Icoltex <span className="text-slate-500">Admin</span>
        </Link>
      </div>
      {adminEmail && (
        <div className="border-b border-slate-200 px-4 py-3">
          <p className="truncate text-xs text-slate-500">{adminEmail}</p>
        </div>
      )}
      <nav className="flex-1 space-y-0.5 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Store className="h-4 w-4 shrink-0" />
          Ir a la tienda
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
