import {
  DEFAULT_SHOP_FILTERS,
  shopFiltersToSearchParams,
  type CatalogFilterMeta,
} from "./shopFilters";

/** Ítems del navbar según Figma (orden fijo). */
export const NAV_CATALOG_ITEMS = [
  { id: "antifluidos", label: "Antifluidos" },
  { id: "dotacion", label: "Dotación" },
  { id: "moda", label: "Moda" },
  { id: "hogar", label: "Hogar y Decoración" },
  { id: "publicidad", label: "Publicidad" },
  { id: "deportivo", label: "Deportivo" },
  { id: "icoltex", label: "Icoltex", href: "/" },
] as const;

export type NavCatalogItem = (typeof NAV_CATALOG_ITEMS)[number];

const ITEMS_PER_COLUMN = 5;
const MAX_COLUMNS = 6;

function normalizeNavKey(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ");
}

/** Resuelve el label del menú al valor real de `filtro1` / línea en el catálogo. */
export function resolveLineaForNav(
  label: string,
  meta: CatalogFilterMeta | null,
): string {
  if (!meta?.lineas?.length) return label;

  const norm = normalizeNavKey(label);
  const exact = meta.lineas.find((c) => normalizeNavKey(c) === norm);
  if (exact) return exact;

  const contains = meta.lineas.find((c) => {
    const cn = normalizeNavKey(c);
    return cn.includes(norm) || norm.includes(cn);
  });
  if (contains) return contains;

  return label;
}

/** @deprecated Use resolveLineaForNav */
export function resolveClaseForNav(
  label: string,
  meta: CatalogFilterMeta | null,
): string {
  return resolveLineaForNav(label, meta);
}

export function productosForNavItem(
  label: string,
  meta: CatalogFilterMeta | null,
): string[] {
  if (!meta) return [];
  const linea = resolveLineaForNav(label, meta);
  return meta.productosByLinea?.[linea] ?? [];
}

/** @deprecated Use productosForNavItem */
export function categoriasForNavItem(
  label: string,
  meta: CatalogFilterMeta | null,
): string[] {
  return productosForNavItem(label, meta);
}

export function shopUrlForLinea(linea: string, nombreVitrina?: string): string {
  const filters = {
    ...DEFAULT_SHOP_FILTERS,
    filtro1: linea,
    nombre: nombreVitrina?.trim() ?? "",
  };
  const qs = shopFiltersToSearchParams(filters).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** @deprecated Use shopUrlForLinea */
export function shopUrlForClase(clase: string, categoria?: string): string {
  return shopUrlForLinea(clase, categoria);
}

export function shopUrlForSearch(query: string): string {
  const q = query.trim();
  if (!q) return "/shop";
  const filters = { ...DEFAULT_SHOP_FILTERS, q };
  const qs = shopFiltersToSearchParams(filters).toString();
  return `/shop?${qs}`;
}

/** Divide productos (nombreVitrina) en columnas para el mega menú. */
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
  lineaParam: string | null,
  meta: CatalogFilterMeta | null,
): boolean {
  if (pathname !== "/shop" || !lineaParam) return false;
  const resolved = resolveLineaForNav(label, meta);
  return (
    normalizeNavKey(lineaParam) === normalizeNavKey(resolved) ||
    normalizeNavKey(lineaParam) === normalizeNavKey(label)
  );
}
