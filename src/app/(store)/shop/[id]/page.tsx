"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";
import { ProductDetail } from "@/components/shop/ProductDetail";
import type { ProductDetailData, ProductVariantOption } from "@/components/shop/ProductDetail";
import type { ProductCardData } from "@/components/shop/ProductCard";
import {
  fetchGroupedProductByGroupId,
  fetchRelatedGroupCards,
  isMongoObjectId,
  type GroupedProductRow,
  type GroupedProductVariant,
} from "@/lib/groupedCatalog";
import { mapImageUrlsForDisplay } from "@/lib/products";

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
    const res = await fetch(getApiUrl(`/api/products?${params}`));
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

export default function ShopProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const isGroupRoute = id ? !isMongoObjectId(id) : false;
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [grouped, setGrouped] = useState<GroupedProductRow | null>(null);
  const [related, setRelated] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID no válido");
      return;
    }
    setLoading(true);
    setError("");
    setProduct(null);
    setGrouped(null);
    setRelated([]);

    if (isMongoObjectId(id)) {
      fetch(getApiUrl(`/api/products/${id}`))
        .then((res) => res.json())
        .then((data: ProductResponse & { error?: string }) => {
          if (data.error) throw new Error(data.error);
          setProduct(toDetailData(data));
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
        .finally(() => setLoading(false));
      return;
    }

    fetchGroupedProductByGroupId(id)
      .then((group) => {
        if (!group.variantes.length) throw new Error("Grupo sin variantes");
        setGrouped(group);
        setProduct(mapVariantToDetail(group.variantes[0], group));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || loading || !product) return;
    if (isGroupRoute && !grouped) return;

    let cancelled = false;

    async function loadRelated() {
      try {
        const list = isGroupRoute
          ? await fetchRelatedGroupCards(grouped!, 8)
          : await fetchRelatedSkuCards(product!, 8);
        if (!cancelled) setRelated(list);
      } catch {
        if (!cancelled) setRelated([]);
      }
    }

    loadRelated();
    return () => {
      cancelled = true;
    };
  }, [id, isGroupRoute, loading, product, grouped?.groupId]);

  if (loading && !product) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-slate-500">Cargando producto...</p>
        <Link href="/shop" className="text-sm text-slate-600 hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/shop" className="text-sm text-slate-600 hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-slate-500">Producto no encontrado.</p>
        <Link href="/shop" className="text-sm text-slate-600 hover:underline">
          ← Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <ProductDetail
      product={product}
      relatedProducts={related}
      tituloVitrina={grouped ? grouped.nombreVitrina : undefined}
      variantes={grouped ? toVariantOptions(grouped.variantes) : undefined}
      variantesGroupId={grouped?.groupId}
      groupImageUrls={grouped?.imageUrls}
    />
  );
}
