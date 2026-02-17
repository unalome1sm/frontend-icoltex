import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-base font-semibold text-slate-900">
                Icoltex Telas
              </p>
              <p className="text-xs">
                Telas para moda, hogar y confección profesional. Envíos a
                todo el país y cortes desde 1 metro.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Tienda
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-slate-900"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop"
                    className="transition-colors hover:text-slate-900"
                  >
                    Catálogo / Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/checkout"
                    className="transition-colors hover:text-slate-900"
                  >
                    Checkout
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Información
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-slate-900"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-slate-900"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Soporte
              </h3>
              <ul className="mt-3 space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-slate-900"
                  >
                    Contacto
                  </Link>
                </li>
                <li className="text-slate-400">Preguntas frecuentes (pronto)</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse items-center justify-between gap-2 border-t pt-4 text-xs text-slate-400 sm:flex-row">
            <p>
              © {new Date().getFullYear()} Icoltex. Todos los derechos
              reservados.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
              >
                Términos
              </button>
              <button
                type="button"
                className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
              >
                Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
