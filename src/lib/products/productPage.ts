import { getApiUrl } from "../api";
import type { ProductCardData, ProductDetailData, ProductVariantOption } from "@/components/shop";
import {
  fetchGroupedProductByGroupId,
  fetchRelatedGroupCards,
  isMongoObjectId,
  type GroupedProductRow,
  type GroupedProductVariant,
} from "../catalog/groupedCatalog";
import { mapImageUrlsForDisplay } from "./products";

type ProductResponse = {
  _id: string;
  codigo?: string;
  nombre: string;
  claseFamilia?: string;
  categoria?: string;
  stock: number;
  colores?: string;
  unidadMedida?: string;
  caracteristica?: string;
  recomendacionesCuidados?: string;
  recomendacionesUsos?: string;
  precioMetro?: number;
  precioKilos?: number;
  imageUrls?: string[];
};

export type ProductPageData = {
  product: ProductDetailData;
  grouped: GroupedProductRow | null;
  related: ProductCardData[];
  tituloVitrina?: string;
  variantes?: ProductVariantOption[];
  variantesGroupId?: string;
  groupImageUrls?: string[];
  canonicalId: string;
};

function toDetailData(p: ProductResponse): ProductDetailData {
  const imageUrls = mapImageUrlsForDisplay(p.imageUrls ?? []);
  return {
    id: p._id,
    nombre: p.nombre,
    codigo: p.codigo,
    categoria: p.categoria,
    claseFamilia: p.claseFamilia,
    stock: p.stock ?? 0,
    precioMetro: p.precioMetro,
    precioKilos: p.precioKilos,
    imageUrls: imageUrls.length ? imageUrls : undefined,
    colores: p.colores,
    caracteristica: p.caracteristica,
    recomendacionesUsos: p.recomendacionesUsos,
    recomendacionesCuidados: p.recomendacionesCuidados,
    unidadMedida: p.unidadMedida,
  };
}

function toCardData(p: ProductResponse): ProductCardData {
  const imageUrls = mapImageUrlsForDisplay(p.imageUrls ?? []);
  return {
    id: p._id,
    nombre: p.nombre,
    descripcion: p.caracteristica,
    precioMetro: p.precioMetro,
    colores: p.colores,
    imageUrls: imageUrls.length ? imageUrls : undefined,
  };
}

function mapVariantToDetail(v: GroupedProductVariant, group: GroupedProductRow): ProductDetailData {
  const sourceUrls = v.imageUrls?.length ? v.imageUrls : (group.imageUrls ?? []);
  const imageUrls = mapImageUrlsForDisplay(sourceUrls);
  return {
    id: v.mongoId,
    nombre: v.itemNameCompleto,
    codigo: v.codigo,
    categoria: group.categoria,
    claseFamilia: group.claseFamilia,
    stock: v.stock,
    precioMetro: v.precioMetro,
    precioKilos: v.precioKilos,
    imageUrls: imageUrls.length ? imageUrls : undefined,
    colores: v.colorLabel,
    caracteristica: v.caracteristica,
    recomendacionesUsos: v.recomendacionesUsos,
    recomendacionesCuidados: v.recomendacionesCuidados,
    unidadMedida: v.unidadMedida,
  };
}

function toVariantOptions(rows: GroupedProductVariant[]): ProductVariantOption[] {
  return rows.map((v) => ({
    mongoId: v.mongoId,
    codigo: v.codigo,
    colorLabel: v.colorLabel,
    itemNameCompleto: v.itemNameCompleto,
    stock: v.stock,
    precioMetro: v.precioMetro,
    precioKilos: v.precioKilos,
    imageUrls: v.imageUrls,
    caracteristica: v.caracteristica,
    recomendacionesUsos: v.recomendacionesUsos,
    recomendacionesCuidados: v.recomendacionesCuidados,
    unidadMedida: v.unidadMedida,
  }));
}

async function fetchRelatedSkuCards(
  current: ProductDetailData,
  limit = 8,
): Promise<ProductCardData[]> {
  const excludeId = current.id;

  async function fromQuery(params: URLSearchParams): Promise<ProductCardData[]> {
    const res = await fetch(getApiUrl(`/api/products?${params}`), {
      next: { revalidate: 300 },
    });
    const data = (await res.json()) as { products?: ProductResponse[] };
    return (data.products ?? [])
      .filter((p) => p._id !== excludeId)
      .slice(0, limit)
      .map(toCardData);
  }

  if (current.categoria) {
    const byCategory = new URLSearchParams();
    byCategory.set("category", current.categoria);
    byCategory.set("limit", "12");
    const list = await fromQuery(byCategory);
    if (list.length > 0) return list;
  }

  const fallback = new URLSearchParams();
  fallback.set("limit", "20");
  return fromQuery(fallback);
}

export async function loadProductPageData(id: string): Promise<ProductPageData | null> {
  if (!id) return null;

  if (isMongoObjectId(id)) {
    const res = await fetch(getApiUrl(`/api/products/${id}`), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = (await res.json()) as ProductResponse & { error?: string };
    if (data.error) return null;

    const product = toDetailData(data);
    const related = await fetchRelatedSkuCards(product, 8).catch(() => []);

    return {
      product,
      grouped: null,
      related,
      canonicalId: id,
    };
  }

  const grouped = await fetchGroupedProductByGroupId(id).catch(() => null);
  if (!grouped?.variantes.length) return null;

  const product = mapVariantToDetail(grouped.variantes[0], grouped);
  const related = await fetchRelatedGroupCards(grouped, 8).catch(() => []);

  return {
    product,
    grouped,
    related,
    tituloVitrina: grouped.nombreVitrina,
    variantes: toVariantOptions(grouped.variantes),
    variantesGroupId: grouped.groupId,
    groupImageUrls: grouped.imageUrls,
    canonicalId: id,
  };
}
