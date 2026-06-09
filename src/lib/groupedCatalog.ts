import { getApiUrl } from "@/lib/api";
import type { ProductCardData } from "@/components/shop/ProductCard";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

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
};

export type GroupedProductRow = {
  groupId: string;
  groupKey: string;
  nombreVitrina: string;
  claseFamilia?: string;
  categoria?: string;
  variantes: GroupedProductVariant[];
  precioDesde?: number;
  variantCount: number;
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
  const q = sp.toString();
  const res = await fetch(getApiUrl(`/api/catalog/grouped-products${q ? `?${q}` : ""}`));
  const data = (await res.json()) as GroupedProductsResponse;
  if (!res.ok) throw new Error(data.error ?? "Error al cargar catálogo");
  return data;
}

export async function fetchGroupedProductByGroupId(groupId: string): Promise<GroupedProductRow> {
  const res = await fetch(getApiUrl(`/api/catalog/grouped-products/${encodeURIComponent(groupId)}`));
  const data = (await res.json()) as GroupedProductRow & { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Grupo no encontrado");
  return data;
}

export function groupedRowToCardData(row: GroupedProductRow): ProductCardData {
  const first = row.variantes[0];
  const rawUrls = first?.imageUrls ?? [];
  const imageUrls = rawUrls
    .map((u) => getImageDisplayUrl(toDirectImageUrl(u)))
    .filter(Boolean);
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
  };
}
