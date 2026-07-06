"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminGroupProductDetail } from "@/components/admin/catalog/AdminGroupProductDetail";
import {
  AdminSkuProductDetail,
  type AdminSkuProduct,
} from "@/components/admin/catalog/AdminSkuProductDetail";
import { getApiUrl, getAuthHeaders } from "@/lib/api";
import { fetchGroupedProductByGroupId, isMongoObjectId } from "@/lib/groupedCatalog";
import type { GroupedProductRow } from "@/lib/groupedCatalog";

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? decodeURIComponent(params.id) : "";

  const [group, setGroup] = useState<GroupedProductRow | null>(null);
  const [sku, setSku] = useState<AdminSkuProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSkuRoute = isMongoObjectId(id);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID no válido");
      return;
    }

    setLoading(true);
    setError("");
    setGroup(null);
    setSku(null);

    if (isSkuRoute) {
      fetch(getApiUrl(`/api/products/${id}`), {
        credentials: "include",
        headers: getAuthHeaders(),
      })
        .then((res) => res.json())
        .then((data: AdminSkuProduct & { error?: string }) => {
          if (data.error) throw new Error(data.error);
          setSku(data);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Error al cargar SKU"))
        .finally(() => setLoading(false));
      return;
    }

    fetchGroupedProductByGroupId(id)
      .then(setGroup)
      .catch((e) => setError(e instanceof Error ? e.message : "Grupo no encontrado"))
      .finally(() => setLoading(false));
  }, [id, isSkuRoute]);

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <p className="text-slate-500">Cargando…</p>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  if (isSkuRoute && sku) {
    return <AdminSkuProductDetail product={sku} />;
  }

  if (group) {
    return <AdminGroupProductDetail group={group} />;
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-500">No encontrado.</p>
      <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
        ← Volver al catálogo
      </Link>
    </div>
  );
}
