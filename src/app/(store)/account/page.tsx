import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-slate-900">Bienvenido a tu cuenta</h2>
      <p className="mb-6 text-sm text-slate-600">
        Aquí puedes ver tu información y acceder a opciones limitadas.
      </p>
      <div className="space-y-3">
        <Link
          href="/account/profile"
          className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Configurar perfil
        </Link>
        <Link
          href="/shop"
          className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Ver catálogo
        </Link>
        <Link
          href="/"
          className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
