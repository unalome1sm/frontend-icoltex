"use client";

import Link from "next/link";
import {
  formatGroupedPrice,
  isMongoObjectId,
  variantDisplayPriceForRow,
  type GroupedProductVariant,
} from "@/lib/groupedCatalog";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type Props = {
  variantes: GroupedProductVariant[];
};

function VariantThumb({ urls }: { urls?: string[] }) {
  const raw = urls?.[0];
  if (!raw) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
        —
      </span>
    );
  }
  const src = getImageDisplayUrl(toDirectImageUrl(raw));
  return (
    <img
      src={src}
      alt=""
      className="h-10 w-10 rounded border border-slate-200 object-cover"
      loading="lazy"
    />
  );
}

export function AdminVariantTable({ variantes }: Props) {
  if (variantes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
        Este grupo no tiene variantes.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[960px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
            <th className="px-3 py-3">Img</th>
            <th className="px-3 py-3">Código</th>
            <th className="px-3 py-3">Color</th>
            <th className="px-3 py-3">Nombre completo</th>
            <th className="px-3 py-3 text-right">Stock</th>
            <th className="px-3 py-3">U.M.</th>
            <th className="px-3 py-3 text-right">Precio</th>
            <th className="px-3 py-3">Característica</th>
            <th className="px-3 py-3">Activo</th>
            <th className="px-3 py-3">Precio SAP</th>
            <th className="px-3 py-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {variantes.map((v) => {
            const price = variantDisplayPriceForRow(v);
            const isKg = v.unidadMedida?.toUpperCase() === "KG";
            const canLinkSku = isMongoObjectId(v.mongoId);

            return (
              <tr key={v.codigo} className="border-b border-slate-100 hover:bg-slate-50/80">
                <td className="px-3 py-2">
                  <VariantThumb urls={v.imageUrls} />
                </td>
                <td className="px-3 py-2 font-mono text-xs">{v.codigo}</td>
                <td className="px-3 py-2 text-slate-800">{v.colorLabel}</td>
                <td className="max-w-[200px] truncate px-3 py-2 text-slate-700" title={v.itemNameCompleto}>
                  {v.itemNameCompleto}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{v.stock}</td>
                <td className="px-3 py-2 text-slate-600">{v.unidadMedida ?? "—"}</td>
                <td className="px-3 py-2 text-right font-medium text-slate-900">
                  {price != null ? (
                    <>
                      {formatGroupedPrice(price)}
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        {isKg ? "/kg" : "/m"}
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 text-slate-600">{v.caracteristica ?? "—"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.activo ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {v.activo ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {v.tienePrecio === false ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Sin precio
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">OK</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {canLinkSku ? (
                    <Link
                      href={`/admin/products/${v.mongoId}`}
                      className="text-xs font-medium text-slate-700 underline hover:text-slate-900"
                    >
                      Ver SKU
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
