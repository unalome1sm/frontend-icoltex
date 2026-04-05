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
  groupedRowToCardData,
  isMongoObjectId,
  type GroupedProductRow,
  type GroupedProductVariant,
} from "@/lib/groupedCatalog";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

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
  const imageUrls = (p.imageUrls ?? []).map((u) => getImageDisplayUrl(toDirectImageUrl(u))).filter(Boolean);
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
  const imageUrls = (p.imageUrls ?? []).map((u) => getImageDisplayUrl(toDirectImageUrl(u))).filter(Boolean);
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
  const imageUrls = (v.imageUrls ?? []).map((u) => getImageDisplayUrl(toDirectImageUrl(u))).filter(Boolean);
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

export default function ShopProductPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
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
    setGrouped(null);

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
    if (!product?.id) {
      setRelated([]);
      return;
    }

    if (grouped) {
      const sp = new URLSearchParams();
      if (grouped.categoria) sp.set("category", grouped.categoria);
      sp.set("limit", "40");
      fetch(getApiUrl(`/api/catalog/grouped-products?${sp}`))
        .then((r) => r.json())
        .then((data: { groups?: GroupedProductRow[] }) => {
          const list = (data.groups ?? [])
            .filter((g) => g.groupId !== grouped.groupId)
            .slice(0, 8)
            .map(groupedRowToCardData);
          setRelated(list);
        })
        .catch(() => setRelated([]));
      return;
    }

    const byCategory = new URLSearchParams();
    if (product.categoria) byCategory.set("category", product.categoria);
    byCategory.set("limit", "12");

    fetch(getApiUrl(`/api/products?${byCategory}`))
      .then((res) => res.json())
      .then((data: { products?: ProductResponse[] }) => {
        const list = data.products ?? [];
        let relatedList = list
          .filter((p) => p._id !== product.id)
          .slice(0, 8)
          .map(toCardData);

        if (relatedList.length >= 8) return Promise.resolve(relatedList);

        return fetch(getApiUrl("/api/products?limit=20"))
          .then((r) => r.json())
          .then((d: { products?: ProductResponse[] }) => {
            const all = (d.products ?? []).map(toCardData);
            const ids = new Set(relatedList.map((x) => x.id));
            for (const p of all) {
              if (relatedList.length >= 8) break;
              if (p.id !== product.id && !ids.has(p.id)) {
                ids.add(p.id);
                relatedList.push(p);
              }
            }
            return relatedList;
          })
          .catch(() => relatedList);
      })
      .then(setRelated)
      .catch(() => {
        fetch(getApiUrl("/api/products?limit=9"))
          .then((res) => res.json())
          .then((data: { products?: ProductResponse[] }) => {
            const list = data.products ?? [];
            const relatedList = list
              .filter((p) => p._id !== product.id)
              .slice(0, 8)
              .map(toCardData);
            setRelated(relatedList);
          })
          .catch(() => setRelated([]));
      });
  }, [product?.id, product?.categoria, grouped]);

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
    />
  );
}
