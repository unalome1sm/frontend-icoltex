import {
  DEFAULT_SHOP_FILTERS,
  shopFiltersToSearchParams,
  type CatalogFilterMeta,
} from "@/lib/shopFilters";

/** Ítems del navbar según Figma (orden fijo). */
export const NAV_CATALOG_ITEMS = [
  { id: "antifluidos", label: "Antifluidos" },
  { id: "dotacion", label: "Dotación" },
  { id: "moda", label: "Moda" },
  { id: "hogar", label: "Hogar y Decoración" },
  { id: "publicidad", label: "Publicidad" },
  { id: "icoltex", label: "Icoltex", href: "/" },
] as const;

export type NavCatalogItem = (typeof NAV_CATALOG_ITEMS)[number];

const ITEMS_PER_COLUMN = 5;
const MAX_COLUMNS = 6;

/** Resuelve el label del menú al valor real de `clase` en el catálogo. */
export function resolveClaseForNav(
  label: string,
  meta: CatalogFilterMeta | null,
): string {
  if (!meta?.clases.length) return label;

  const norm = label.trim().toLocaleLowerCase("es");
  const exact = meta.clases.find((c) => c.toLocaleLowerCase("es") === norm);
  if (exact) return exact;

  const contains = meta.clases.find(
    (c) =>
      c.toLocaleLowerCase("es").includes(norm) ||
      norm.includes(c.toLocaleLowerCase("es")),
  );
  if (contains) return contains;

  return label;
}

export function categoriasForNavItem(
  label: string,
  meta: CatalogFilterMeta | null,
): string[] {
  if (!meta) return [];
  const clase = resolveClaseForNav(label, meta);
  return meta.categoriasByClase[clase] ?? [];
}

export function shopUrlForClase(clase: string, categoria?: string): string {
  const filters = {
    ...DEFAULT_SHOP_FILTERS,
    classFamily: clase,
    categories: categoria ? [categoria] : [],
  };
  const qs = shopFiltersToSearchParams(filters).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function shopUrlForSearch(query: string): string {
  const q = query.trim();
  if (!q) return "/shop";
  const filters = { ...DEFAULT_SHOP_FILTERS, q };
  const qs = shopFiltersToSearchParams(filters).toString();
  return `/shop?${qs}`;
}

/** Divide categorías en columnas para el mega menú. */
export function chunkCategorias(categorias: string[]): string[][] {
  if (categorias.length === 0) return [];

  const cols: string[][] = [];
  for (let i = 0; i < categorias.length && cols.length < MAX_COLUMNS; i += ITEMS_PER_COLUMN) {
    cols.push(categorias.slice(i, i + ITEMS_PER_COLUMN));
  }
  return cols;
}

export function isNavItemActive(
  label: string,
  pathname: string,
  claseParam: string | null,
  meta: CatalogFilterMeta | null,
): boolean {
  if (pathname !== "/shop" || !claseParam) return false;
  const resolved = resolveClaseForNav(label, meta);
  return (
    claseParam === resolved ||
    claseParam.toLocaleLowerCase("es") === label.toLocaleLowerCase("es")
  );
}
