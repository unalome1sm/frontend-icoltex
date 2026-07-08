"use client";

import Link from "next/link";
import { AdminImageGallery } from "../shared/AdminImageGallery";
import { formatGroupedPrice } from "@/lib/catalog";

export type AdminSkuProduct = {
  _id: string;
  codigo: string;
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
  activo: boolean;
  imageUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
};

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (value == null || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1 text-sm text-slate-900 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

type Props = {
  product: AdminSkuProduct;
};

export function AdminSkuProductDetail({ product }: Props) {
  const isKg = product.unidadMedida?.toUpperCase() === "KG";
  const price = isKg ? product.precioKilos ?? product.precioMetro : product.precioMetro ?? product.precioKilos;
  const skuImages = product.imageUrls ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">SKU (items_icoltex)</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">{product.nombre}</h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{product.codigo}</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Volver al catálogo
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Datos del SKU
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Código" value={product.codigo} mono />
            <DetailRow label="Nombre" value={product.nombre} />
            <DetailRow label="Clase / Familia" value={product.claseFamilia} />
            <DetailRow label="Categoría" value={product.categoria} />
            <DetailRow label="Colores" value={product.colores} />
            <DetailRow label="Unidad de medida" value={product.unidadMedida} />
            <DetailRow label="Stock (SAP)" value={product.stock != null ? String(product.stock) : undefined} />
            <DetailRow
              label="Precio"
              value={price != null ? `${formatGroupedPrice(price)} ${isKg ? "/kg" : "/m"}` : undefined}
            />
            <DetailRow label="Precio por metro" value={product.precioMetro != null ? formatGroupedPrice(product.precioMetro) : undefined} />
            <DetailRow label="Precio por kilos" value={product.precioKilos != null ? formatGroupedPrice(product.precioKilos) : undefined} />
            <DetailRow label="Característica" value={product.caracteristica} />
            <DetailRow label="Recomendaciones de cuidados" value={product.recomendacionesCuidados} />
            <DetailRow label="Recomendaciones de usos" value={product.recomendacionesUsos} />
            <DetailRow label="Estado" value={product.activo ? "Activo" : "Inactivo"} />
            {product.updatedAt && (
              <DetailRow
                label="Última actualización"
                value={new Date(product.updatedAt).toLocaleString("es-CO")}
              />
            )}
          </dl>
        </div>

        <AdminImageGallery
          urls={skuImages}
          title="Imágenes del SKU (items_icoltex)"
          emptyMessage="Este SKU no tiene imágenes en items_icoltex."
        />
      </div>

      <p className="text-xs text-slate-500">
        Galerías manuales por línea:{" "}
        <Link href="/admin/galleries" className="font-medium underline hover:no-underline">
          Galerías por línea
        </Link>
      </p>
    </div>
  );
}
