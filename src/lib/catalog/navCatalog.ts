import {
  DEFAULT_SHOP_FILTERS,
  shopFiltersToSearchParams,
  type CatalogFilterMeta,
  usosForLinea,
  prendasForLinea,
} from "./shopFilters";

/** Ítems del navbar según Figma (orden fijo). */
export const NAV_CATALOG_ITEMS = [
  { id: "antifluidos", label: "Antifluidos" },
  { id: "dotacion", label: "Dotación" },
  { id: "moda", label: "Moda" },
  { id: "hogar", label: "Hogar y Decoración" },
  { id: "publicidad", label: "Publicidad" },
  { id: "deportivo", label: "Deportivo" },
] as const;

export type NavCatalogItem = (typeof NAV_CATALOG_ITEMS)[number];

/**
 * Valores canónicos de filtro1 en JSON/SAP.
 * Tras sync (POST /api/sync/catalog-vitrina), el mega menú usa estos keys en filter-meta.
 */
export const NAV_FILTRO1_BY_ID = {
  antifluidos: "ANTIFLUIDOS",
  dotacion: "DOTACION",
  moda: "MODA",
  hogar: "HOGAR Y DECORACION",
  publicidad: "PUBLICIDAD",
  deportivo: "DEPORTIVO",
} as const;

export type NavCatalogId = keyof typeof NAV_FILTRO1_BY_ID;

/** Mega menú: usos (filtro2) y prendas (filtro3) por línea comercial. */
export type NavMegaMenuLink = {
  label: string;
  kind: "uso" | "prenda";
};

const NAV_ITEMS_PER_COLUMN = 5;
const NAV_MAX_COLUMNS = 4;

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

function canonicalFiltro1ForNavLabel(label: string): string | undefined {
  const item = NAV_CATALOG_ITEMS.find(
    (entry) => normalizeNavKey(entry.label) === normalizeNavKey(label),
  );
  if (!item) return undefined;
  return NAV_FILTRO1_BY_ID[item.id];
}

function findLineaInMeta(meta: CatalogFilterMeta, candidate: string): string | undefined {
  const norm = normalizeNavKey(candidate);
  const exact = meta.lineas.find((linea) => normalizeNavKey(linea) === norm);
  if (exact) return exact;

  return meta.lineas.find((linea) => {
    const lineaNorm = normalizeNavKey(linea);
    return lineaNorm.includes(norm) || norm.includes(lineaNorm);
  });
}

/** Resuelve el label del menú al valor real de `filtro1` / línea en el catálogo. */
export function resolveLineaForNav(
  label: string,
  meta: CatalogFilterMeta | null,
): string {
  const canonical = canonicalFiltro1ForNavLabel(label);

  if (meta?.lineas?.length) {
    if (canonical) {
      const fromCanonical = findLineaInMeta(meta, canonical);
      if (fromCanonical) return fromCanonical;
    }

    const fromLabel = findLineaInMeta(meta, label);
    if (fromLabel) return fromLabel;
  }

  if (canonical) return canonical;
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

export function shopUrlForUso(linea: string, uso: string): string {
  const filters = {
    ...DEFAULT_SHOP_FILTERS,
    filtro1: linea,
    filtro2: [uso.trim()],
  };
  const qs = shopFiltersToSearchParams(filters).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function shopUrlForPrenda(linea: string, prenda: string): string {
  const filters = {
    ...DEFAULT_SHOP_FILTERS,
    filtro1: linea,
    filtro3: [prenda.trim()],
  };
  const qs = shopFiltersToSearchParams(filters).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Usos + prendas de una línea, en el orden del mega menú (Figma). */
export function navMegaMenuLinksForLinea(
  label: string,
  meta: CatalogFilterMeta | null,
): NavMegaMenuLink[] {
  if (!meta) return [];
  const linea = resolveLineaForNav(label, meta);
  const usos = usosForLinea(meta, linea);
  const prendas = prendasForLinea(meta, linea);
  return [
    ...usos.map((entry) => ({ label: entry, kind: "uso" as const })),
    ...prendas.map((entry) => ({ label: entry, kind: "prenda" as const })),
  ];
}

export function navMegaMenuHref(linea: string, link: NavMegaMenuLink): string {
  return link.kind === "uso"
    ? shopUrlForUso(linea, link.label)
    : shopUrlForPrenda(linea, link.label);
}

/** Divide links del mega menú en columnas (máx. 4 × 5 ítems). */
export function chunkNavMegaMenuLinks(links: NavMegaMenuLink[]): NavMegaMenuLink[][] {
  if (links.length === 0) return [];

  const cols: NavMegaMenuLink[][] = [];
  for (
    let i = 0;
    i < links.length && cols.length < NAV_MAX_COLUMNS;
    i += NAV_ITEMS_PER_COLUMN
  ) {
    cols.push(links.slice(i, i + NAV_ITEMS_PER_COLUMN));
  }
  return cols;
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
  const canonical = canonicalFiltro1ForNavLabel(label);
  return (
    normalizeNavKey(lineaParam) === normalizeNavKey(resolved) ||
    normalizeNavKey(lineaParam) === normalizeNavKey(label) ||
    (canonical != null && normalizeNavKey(lineaParam) === normalizeNavKey(canonical))
  );
}
