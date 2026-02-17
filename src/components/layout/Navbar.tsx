import Link from "next/link";
import { ChevronDown, ShoppingCart, User } from "lucide-react";

const productFamilies = [
  {
    name: "Moda y confección",
    items: [
      { name: "Camiseros", slug: "camiseros" },
      { name: "Satines", slug: "satines" },
      { name: "Driles", slug: "driles" },
      { name: "Indigo", slug: "indigo" },
      { name: "Camisetas", slug: "camisetas" },
      { name: "Confecciones", slug: "confecciones" },
      { name: "Generos", slug: "generos" },
    ],
  },
  {
    name: "Técnicos y protección",
    items: [
      { name: "Impermeables", slug: "impermeables" },
      { name: "Antifluidos", slug: "antifluidos" },
      { name: "Gabardinas", slug: "gabardinas" },
      { name: "Lonas", slug: "lonas" },
      { name: "Nautica", slug: "nautica" },
      { name: "Politex", slug: "politex" },
    ],
  },
  {
    name: "Deportivos y elásticos",
    items: [
      { name: "Mallas", slug: "mallas" },
      { name: "Licras", slug: "licras" },
      { name: "Medias", slug: "medias" },
    ],
  },
  {
    name: "Hogar y especiales",
    items: [
      { name: "Peluches", slug: "peluches" },
      { name: "Perchados", slug: "perchados" },
    ],
  },
  {
    name: "Complementos",
    items: [
      { name: "Forros", slug: "forros" },
      { name: "Insumos", slug: "insumos" },
    ],
  },
];

export function Navbar() {
  return (
    <header className="w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Icoltex <span className="text-slate-500">Telas</span>
        </Link>

        {/* Navegación de familias de producto (escritorio) */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {productFamilies.map((family) => (
            <div key={family.name} className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-slate-700 transition-colors hover:text-slate-900"
              >
                <span>{family.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <div className="invisible absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 text-xs text-slate-700 opacity-0 shadow-lg ring-1 ring-slate-900/5 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {family.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/shop?category=${item.slug}`}
                    className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-semibold text-white">
              0
            </span>
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            aria-label="Perfil de usuario"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Menú móvil: familias y clases */}
      <nav className="border-t bg-white px-4 py-3 text-sm text-slate-700 md:hidden">
        <div className="space-y-4">
          {productFamilies.map((family) => (
            <div key={family.name} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {family.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {family.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/shop?category=${item.slug}`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs transition-colors hover:bg-slate-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
