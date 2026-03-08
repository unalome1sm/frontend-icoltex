import Link from "next/link";

const TOP_BAR_BG = "#F5F5F5";

export function TopBar() {
  return (
    <div
      className="w-full text-sm text-slate-700"
      style={{ backgroundColor: TOP_BAR_BG }}
    >
      <div className="flex w-full items-center justify-end px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/contact" className="hover:underline">
          Ayuda
        </Link>
        <span className="mx-3 text-slate-300" aria-hidden>
          |
        </span>
        <Link href="/register" className="hover:underline">
          Registrarse
        </Link>
        <span className="mx-3 text-slate-300" aria-hidden>
          |
        </span>
        <Link href="/login" className="hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
