import { apiFetch, getApiUrl } from "../api";
import type { ProductCardData } from "@/components/shop";
import { mapImageUrlsForDisplay } from "../products/products";

export type CatalogVitrinaFiltros = {
  filtro1: string[];
  filtro2: string[];
  filtro3: string[];
};

export type GroupedProductVariant = {
  mongoId: string;
  codigo: string;
  colorLabel: string;
  codigoTono?: string;
  itemNameCompleto: string;
  stock: number;
  precioMetro?: number;
  precioKilos?: number;
  activo: boolean;
  imageUrls?: string[];
  caracteristica?: string;
  recomendacionesUsos?: string;
  recomendacionesCuidados?: string;
  unidadMedida?: string;
  tienePrecio?: boolean;
};

export type GroupedProductRow = {
  groupId: string;
  groupKey: string;
  nombreVitrina: string;
  claseFamilia?: string;
  categoria?: string;
  imageUrls?: string[];
  filtros?: CatalogVitrinaFiltros[];
  variantes: GroupedProductVariant[];
  precioDesde?: number;
  variantCount: number;
  esDestacado?: boolean;
  esNovedad?: boolean;
};

export type CatalogSortOption = "relevance" | "price-asc" | "price-desc" | "name";

export type GroupedProductsQuery = {
  page?: number;
  limit?: number;
  category?: string;
  categories?: string[];
  classFamily?: string;
  colors?: string[];
  q?: string;
  activo?: boolean;
  precioMin?: number;
  precioMax?: number;
  inStock?: boolean;
  sort?: CatalogSortOption;
  destacado?: boolean;
  novedad?: boolean;
};

export type GroupedProductsResponse = {
  groups: GroupedProductRow[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  source?: string;
  error?: string;
};

function variantDisplayPrice(v: GroupedProductVariant): number | undefined {
  const isKg = v.unidadMedida?.toUpperCase() === "KG";
  if (isKg) return v.precioKilos ?? v.precioMetro;
  return v.precioMetro ?? v.precioKilos;
}

/** Primera URL de imagen del grupo o de sus variantes (raw Drive URLs). */
export function resolveGroupThumbnailUrl(row: GroupedProductRow): string | undefined {
  if (row.imageUrls?.[0]) return row.imageUrls[0];
  for (const v of row.variantes) {
    if (v.imageUrls?.[0]) return v.imageUrls[0];
  }
  return undefined;
}

/** Badge de origen de imágenes para listado admin. */
export function groupImageSourceLabel(row: GroupedProductRow): "grupo" | "sku" | "ninguna" {
  if (row.imageUrls?.length) return "grupo";
  if (row.variantes.some((v) => v.imageUrls?.length)) return "sku";
  return "ninguna";
}

export function formatGroupedPrice(value?: number): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `$${value.toLocaleString("es-CO")}`;
}

export function variantDisplayPriceForRow(v: GroupedProductVariant): number | undefined {
  return variantDisplayPrice(v);
}

const MONGO_ID_RE = /^[a-f\d]{24}$/i;

export function isMongoObjectId(id: string): boolean {
  return MONGO_ID_RE.test(id);
}

export async function fetchGroupedProductsPage(
  params: GroupedProductsQuery,
): Promise<GroupedProductsResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.classFamily) sp.set("classFamily", params.classFamily);
  if (params.categories?.length) sp.set("categories", params.categories.join(","));
  else if (params.category) sp.set("category", params.category);
  if (params.colors?.length) sp.set("colors", params.colors.join(","));
  if (params.q) sp.set("q", params.q);
  if (params.activo === true) sp.set("activo", "true");
  if (params.activo === false) sp.set("activo", "false");
  if (params.precioMin != null) sp.set("precioMin", String(params.precioMin));
  if (params.precioMax != null) sp.set("precioMax", String(params.precioMax));
  if (params.inStock) sp.set("inStock", "true");
  if (params.sort && params.sort !== "relevance") sp.set("sort", params.sort);
  if (params.destacado) sp.set("destacado", "true");
  if (params.novedad) sp.set("novedad", "true");
  const q = sp.toString();
  const res = await fetch(getApiUrl(`/api/catalog/grouped-products${q ? `?${q}` : ""}`), {
    next: { revalidate: 300 },
  });
  const data = (await res.json()) as GroupedProductsResponse;
  if (!res.ok) throw new Error(data.error ?? "Error al cargar catálogo");
  return data;
}

export async function fetchGroupedProductByGroupId(groupId: string): Promise<GroupedProductRow> {
  const res = await fetch(getApiUrl(`/api/catalog/grouped-products/${encodeURIComponent(groupId)}`), {
    next: { revalidate: 300 },
  });
  const data = (await res.json()) as GroupedProductRow & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Grupo no encontrado");
  return data;
}

export function groupedRowToCardData(row: GroupedProductRow): ProductCardData {
  const first = row.variantes[0];
  const thumb = resolveGroupThumbnailUrl(row);
  const rawUrls = row.imageUrls?.length ? row.imageUrls : thumb ? [thumb] : [];
  const imageUrls = mapImageUrlsForDisplay(rawUrls);
  const colores = row.variantes.map((v) => v.colorLabel).join(",");
  const precio = row.precioDesde ?? (first ? variantDisplayPrice(first) : undefined);

  return {
    id: row.groupId,
    href: `/shop/${row.groupId}`,
    nombre: row.nombreVitrina,
    descripcion: first?.caracteristica,
    precioMetro: precio,
    colores: colores || undefined,
    imageUrls: imageUrls.length ? imageUrls : undefined,
    isNew: row.esNovedad === true,
  };
}

export async function updateGroupMerchandising(
  groupId: string,
  input: { esDestacado?: boolean; esNovedad?: boolean },
): Promise<GroupedProductRow> {
  return apiFetch<GroupedProductRow>(
    `/api/catalog/grouped-products/${encodeURIComponent(groupId)}/merchandising`,
    { method: "PATCH", body: input },
  );
}

const RELATED_MIN_BEFORE_FALLBACK = 4;
const RELATED_FETCH_LIMIT = 40;

function excludeCurrentGroup(
  groups: GroupedProductRow[],
  currentGroupId: string,
): GroupedProductRow[] {
  return groups.filter((g) => g.groupId !== currentGroupId);
}

/** Productos relacionados para detalle agrupado: categoría → clase → catálogo amplio. */
export async function fetchRelatedGroupCards(
  current: GroupedProductRow,
  limit = 8,
): Promise<ProductCardData[]> {
  let candidates: GroupedProductRow[] = [];

  if (current.categoria) {
    const byCategory = await fetchGroupedProductsPage({
      category: current.categoria,
      limit: RELATED_FETCH_LIMIT,
      page: 1,
    });
    candidates = excludeCurrentGroup(byCategory.groups ?? [], current.groupId);
    if (candidates.length >= RELATED_MIN_BEFORE_FALLBACK) {
      return candidates.slice(0, limit).map(groupedRowToCardData);
    }
  }

  if (current.claseFamilia) {
    const byClass = await fetchGroupedProductsPage({
      classFamily: current.claseFamilia,
      limit: RELATED_FETCH_LIMIT,
      page: 1,
    });
    const classList = excludeCurrentGroup(byClass.groups ?? [], current.groupId);
    if (classList.length > candidates.length) {
      candidates = classList;
    }
    if (candidates.length >= RELATED_MIN_BEFORE_FALLBACK) {
      return candidates.slice(0, limit).map(groupedRowToCardData);
    }
  }

  if (candidates.length > 0) {
    return candidates.slice(0, limit).map(groupedRowToCardData);
  }

  const all = await fetchGroupedProductsPage({ limit: RELATED_FETCH_LIMIT, page: 1 });
  candidates = excludeCurrentGroup(all.groups ?? [], current.groupId);
  return candidates.slice(0, limit).map(groupedRowToCardData);
}
