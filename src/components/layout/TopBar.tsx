import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full bg-slate-900 text-slate-100 text-xs sm:text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <p className="hidden sm:block">
          Telas de alta calidad · Envíos a todo el país · Compra mínima 1 metro
        </p>
        <p className="sm:hidden">Telas premium · Envíos nacionales</p>
        <div className="flex items-center gap-4">
          <Link href="/account" className="hover:underline">
            Mi cuenta
          </Link>
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
          <Link href="/contact" className="hover:underline">
            Soporte
          </Link>
          <span className="hidden sm:inline">+57 300 000 0000</span>
        </div>
      </div>
    </div>
  );
}


