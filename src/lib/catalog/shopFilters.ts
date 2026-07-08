import { getApiUrl } from "../api";
import type { CatalogSortOption } from "./groupedCatalog";
import { auditColorLabels, type ColorAuditEntry } from "./colorSwatches";

export type CatalogFilterMeta = {
  clases: string[];
  categoriasByClase: Record<string, string[]>;
  colores: string[];
  precioMin: number | null;
  precioMax: number | null;
  totalGroups: number;
  totalVariants: number;
};

export type ShopFilterState = {
  classFamily: string;
  categories: string[];
  colors: string[];
  inStock: boolean;
  precioMin: string;
  precioMax: string;
  q: string;
  sort: CatalogSortOption;
};

export const DEFAULT_SHOP_FILTERS: ShopFilterState = {
  classFamily: "",
  categories: [],
  colors: [],
  inStock: false,
  precioMin: "",
  precioMax: "",
  q: "",
  sort: "relevance",
};

export function shopFiltersToSearchParams(filters: ShopFilterState, page?: number): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.classFamily) sp.set("clase", filters.classFamily);
  if (filters.categories.length) sp.set("categorias", filters.categories.join(","));
  if (filters.colors.length) sp.set("colores", filters.colors.join(","));
  if (filters.inStock) sp.set("stock", "1");
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
    classFamily: sp.get("clase") ?? "",
    categories: parseList(sp.get("categorias")),
    colors: parseList(sp.get("colores")),
    inStock: sp.get("stock") === "1" || sp.get("stock") === "true",
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
  if (filters.classFamily) n++;
  if (filters.categories.length) n++;
  if (filters.colors.length) n++;
  if (filters.inStock) n++;
  if (filters.precioMin.trim() || filters.precioMax.trim()) n++;
  if (filters.q.trim()) n++;
  return n;
}

export async function fetchCatalogFilterMeta(): Promise<CatalogFilterMeta> {
  const res = await fetch(getApiUrl("/api/catalog/filter-meta"));
  const data = (await res.json()) as CatalogFilterMeta & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Error al cargar filtros");
  return data;
}

/** Audita colorLabels del catálogo: cuáles tienen swatch mapeado vs fallback hash. */
export async function fetchColorLabelAudit(): Promise<{
  mapped: ColorAuditEntry[];
  unmapped: ColorAuditEntry[];
}> {
  const meta = await fetchCatalogFilterMeta();
  return auditColorLabels(meta.colores);
}

export function categoriasForClase(
  meta: CatalogFilterMeta,
  classFamily: string,
): string[] {
  if (!classFamily.trim()) {
    const all = new Set<string>();
    for (const cats of Object.values(meta.categoriasByClase)) {
      for (const c of cats) all.add(c);
    }
    return [...all].sort((a, b) => a.localeCompare(b, "es"));
  }
  return meta.categoriasByClase[classFamily] ?? [];
}
