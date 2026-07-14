"use client";

import type { ShippingData } from "../orderSnapshot";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

type Props = {
  value: ShippingData;
  error: string | null;
  onChange: (next: ShippingData) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function CheckoutShippingForm({ value, error, onChange, onSubmit, onBack }: Props) {
  function patch(partial: Partial<ShippingData>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Departamento *"
            value={value.departamento}
            onChange={(e) => patch({ departamento: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            required
            placeholder="Ciudad *"
            value={value.ciudad}
            onChange={(e) => patch({ ciudad: e.target.value })}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          required
          placeholder="Dirección *"
          value={value.direccion}
          onChange={(e) => patch({ direccion: e.target.value })}
          className={inputClass}
        />
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="tipoVivienda"
              checked={value.tipoVivienda === "casa"}
              onChange={() => patch({ tipoVivienda: "casa", apartamento: "" })}
              className="h-4 w-4 accent-red-600"
            />
            Casa
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              name="tipoVivienda"
              checked={value.tipoVivienda === "edificio"}
              onChange={() => patch({ tipoVivienda: "edificio" })}
              className="h-4 w-4 accent-red-600"
            />
            Edificio / apartamento
          </label>
        </div>
        {value.tipoVivienda === "edificio" && (
          <input
            type="text"
            required
            placeholder="Apartamento / piso *"
            value={value.apartamento}
            onChange={(e) => patch({ apartamento: e.target.value })}
            className={inputClass}
          />
        )}
        <textarea
          rows={3}
          placeholder="Notas de entrega (opcional)"
          value={value.notas}
          onChange={(e) => patch({ notas: e.target.value })}
          className={inputClass}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Volver
          </button>
          <button
            type="submit"
            className="w-full flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Continuar al pago
          </button>
        </div>
      </form>
    </div>
  );
}
