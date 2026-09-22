import { getApiUrl } from "../api";
import type { CatalogSortOption } from "./groupedCatalog";
import { auditColorLabels, type ColorAuditEntry } from "./colorSwatches";

export type CatalogFilterMeta = {
  lineas: string[];
  usosByLinea: Record<string, string[]>;
  prendasByLinea: Record<string, string[]>;
  productosByLinea: Record<string, string[]>;
  colores: string[];
  precioMin: number | null;
  precioMax: number | null;
  totalGroups: number;
  totalVariants: number;
  /** @deprecated Admin / legado técnico */
  clases: string[];
  /** @deprecated Admin / legado técnico */
  categoriasByClase: Record<string, string[]>;
};

export type ShopFilterState = {
  filtro1: string;
  filtro2: string[];
  filtro3: string[];
  /** Match exacto nombreVitrina */
  nombre: string;
  colors: string[];
  inStock: boolean;
  /** Variantes SAP con outlet = Y */
  outlet: boolean;
  precioMin: string;
  precioMax: string;
  q: string;
  sort: CatalogSortOption;
};

export const DEFAULT_SHOP_FILTERS: ShopFilterState = {
  filtro1: "",
  filtro2: [],
  filtro3: [],
  nombre: "",
  colors: [],
  inStock: false,
  outlet: false,
  precioMin: "",
  precioMax: "",
  q: "",
  sort: "relevance",
};

function isOutletParamActive(value: string | null): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "y" || v === "1" || v === "true";
}

export function shopFiltersToSearchParams(filters: ShopFilterState, page?: number): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.filtro1) sp.set("linea", filters.filtro1);
  if (filters.filtro2.length) sp.set("usos", filters.filtro2.join(","));
  if (filters.filtro3.length) sp.set("prendas", filters.filtro3.join(","));
  if (filters.nombre.trim()) sp.set("nombre", filters.nombre.trim());
  if (filters.colors.length) sp.set("colores", filters.colors.join(","));
  if (filters.inStock) sp.set("stock", "1");
  if (filters.outlet) sp.set("outlet", "Y");
  if (filters.precioMin.trim()) sp.set("precioMin", filters.precioMin.trim());
  if (filters.precioMax.trim()) sp.set("precioMax", filters.precioMax.trim());
  if (filters.q.trim()) sp.set("q", filters.q.trim());
  if (filters.sort && filters.sort !== "relevance") sp.set("sort", filters.sort);
  if (page != null && page > 1) sp.set("page", String(page));
  return sp;
}

export function shopFiltersFromSearchParams(sp: URLSearchParams): ShopFilterState {
  const sort = sp.get("sort");
  const validSort: CatalogSortOption[] = ["relevance", "price-asc", "price-desc", "name"];

  return {
    filtro1: sp.get("linea") ?? "",
    filtro2: parseList(sp.get("usos")),
    filtro3: parseList(sp.get("prendas")),
    nombre: sp.get("nombre") ?? "",
    colors: parseList(sp.get("colores")),
    inStock: sp.get("stock") === "1" || sp.get("stock") === "true",
    outlet: isOutletParamActive(sp.get("outlet")),
    precioMin: sp.get("precioMin") ?? "",
    precioMax: sp.get("precioMax") ?? "",
    q: sp.get("q") ?? "",
    sort: validSort.includes(sort as CatalogSortOption)
      ? (sort as CatalogSortOption)
      : "relevance",
  };
}

function parseList(value: string | null): string[] {
  if (!value?.trim()) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function shopFiltersActiveCount(filters: ShopFilterState): number {
  let n = 0;
  if (filters.filtro1) n++;
  if (filters.filtro2.length) n++;
  if (filters.filtro3.length) n++;
  if (filters.nombre.trim()) n++;
  if (filters.colors.length) n++;
  if (filters.inStock) n++;
  if (filters.outlet) n++;
  if (filters.precioMin.trim() || filters.precioMax.trim()) n++;
  if (filters.q.trim()) n++;
  return n;
}

export async function fetchCatalogFilterMeta(): Promise<CatalogFilterMeta> {
  const res = await fetch(getApiUrl("/api/catalog/filter-meta"));
  const data = (await res.json()) as CatalogFilterMeta & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Error al cargar filtros");
  return {
    lineas: data.lineas ?? [],
    usosByLinea: data.usosByLinea ?? {},
    prendasByLinea: data.prendasByLinea ?? {},
    productosByLinea: data.productosByLinea ?? {},
    colores: data.colores ?? [],
    precioMin: data.precioMin ?? null,
    precioMax: data.precioMax ?? null,
    totalGroups: data.totalGroups ?? 0,
    totalVariants: data.totalVariants ?? 0,
    clases: data.clases ?? [],
    categoriasByClase: data.categoriasByClase ?? {},
  };
}

/** Audita colorLabels del catálogo: cuáles tienen swatch mapeado vs fallback hash. */
export async function fetchColorLabelAudit(): Promise<{
  mapped: ColorAuditEntry[];
  unmapped: ColorAuditEntry[];
}> {
  const meta = await fetchCatalogFilterMeta();
  return auditColorLabels(meta.colores);
}

/** @deprecated Prefer usosForLinea / prendasForLinea — admin still uses clases. */
export function categoriasForClase(
  meta: CatalogFilterMeta,
  classFamily: string,
): string[] {
  if (!classFamily.trim()) {
    const all = new Set<string>();
    for (const cats of Object.values(meta.categoriasByClase ?? {})) {
      for (const c of cats) all.add(c);
    }
    return [...all].sort((a, b) => a.localeCompare(b, "es"));
  }
  return meta.categoriasByClase?.[classFamily] ?? [];
}

function valuesForLinea(
  byLinea: Record<string, string[]>,
  filtro1: string,
): string[] {
  if (!filtro1.trim()) {
    const all = new Set<string>();
    for (const values of Object.values(byLinea)) {
      for (const v of values) all.add(v);
    }
    return [...all].sort((a, b) => a.localeCompare(b, "es"));
  }
  return byLinea[filtro1] ?? [];
}

export function usosForLinea(meta: CatalogFilterMeta, filtro1: string): string[] {
  return valuesForLinea(meta.usosByLinea ?? {}, filtro1);
}

export function prendasForLinea(meta: CatalogFilterMeta, filtro1: string): string[] {
  return valuesForLinea(meta.prendasByLinea ?? {}, filtro1);
}
