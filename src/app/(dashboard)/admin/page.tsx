import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Panel de administración</h2>
        <p className="mb-6 text-sm text-slate-600">
          Acceso completo al sistema: sincronizaciones, usuarios y catálogo.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Ver productos
          </Link>
          <Link
            href="/admin/sync"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sincronizar datos
          </Link>
          <Link
            href="/admin/users"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver usuarios
          </Link>
          <Link
            href="/admin/admins"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Administradores
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
