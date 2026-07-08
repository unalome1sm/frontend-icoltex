"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminImageGallery } from "../shared/AdminImageGallery";
import { AdminSapFiltrosPanel } from "../shared/AdminSapFiltrosPanel";
import { AdminVariantTable } from "../shared/AdminVariantTable";
import {
  formatGroupedPrice,
  updateGroupMerchandising,
  type GroupedProductRow,
} from "@/lib/catalog";

type Props = {
  group: GroupedProductRow;
};

function MerchandisingToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

export function AdminGroupProductDetail({ group: initialGroup }: Props) {
  const [group, setGroup] = useState(initialGroup);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const groupImages = group.imageUrls ?? [];

  async function saveFlag(field: "esDestacado" | "esNovedad", value: boolean) {
    setSaving(true);
    setFeedback(null);
    const prev = group[field];
    setGroup((g) => ({ ...g, [field]: value }));
    try {
      const updated = await updateGroupMerchandising(group.groupId, { [field]: value });
      setGroup(updated);
      setFeedback({ type: "ok", msg: "Cambios guardados." });
    } catch (e) {
      setGroup((g) => ({ ...g, [field]: prev }));
      setFeedback({
        type: "err",
        msg: e instanceof Error ? e.message : "No se pudo guardar",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{group.nombreVitrina}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {group.claseFamilia ?? "—"} · {group.categoria ?? "—"}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">{group.groupKey}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/shop/${encodeURIComponent(group.groupId)}`}
            target="_blank"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver en tienda ↗
          </Link>
          <Link
            href="/admin/products"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Volver
          </Link>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Merchandising
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <MerchandisingToggle
            label="Destacado"
            description="Aparece en la sección Destacados del home."
            checked={group.esDestacado === true}
            disabled={saving}
            onChange={(v) => void saveFlag("esDestacado", v)}
          />
          <MerchandisingToggle
            label="Novedad"
            description='Muestra el badge "Lo más nuevo" en tarjetas y tab Novedades.'
            checked={group.esNovedad === true}
            disabled={saving}
            onChange={(v) => void saveFlag("esNovedad", v)}
          />
        </div>
        {feedback && (
          <p
            className={`mt-2 text-sm ${feedback.type === "ok" ? "text-green-700" : "text-red-600"}`}
          >
            {feedback.msg}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Variantes</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{group.variantCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Precio desde</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatGroupedPrice(group.precioDesde)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-slate-500">Imágenes línea</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{groupImages.length}</p>
        </div>
      </div>

      <AdminImageGallery
        urls={groupImages}
        title="Imágenes del grupo (vitrina)"
        emptyMessage="Este grupo no tiene imágenes de línea en info-items-x-ref. Revisa imágenes por SKU en la tabla de variantes."
      />

      <AdminSapFiltrosPanel filtros={group.filtros} />

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Variantes ({group.variantes.length})
        </h2>
        <AdminVariantTable variantes={group.variantes} />
      </div>
    </div>
  );
}
