"use client";

import type { PersonalData } from "../orderSnapshot";

const DOC_TYPES = [
  { value: "", label: "Seleccione un tipo" },
  { value: "cc", label: "Cédula de ciudadanía" },
  { value: "ce", label: "Cédula de extranjería" },
  { value: "nit", label: "NIT" },
  { value: "pasaporte", label: "Pasaporte" },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

type Props = {
  value: PersonalData;
  error: string | null;
  onChange: (next: PersonalData) => void;
  onSubmit: () => void;
};

export function CheckoutPersonalForm({ value, error, onChange, onSubmit }: Props) {
  function patch(partial: Partial<PersonalData>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="border-t border-slate-200 px-5 pb-5 pt-2">
      <p className="mb-4 text-sm text-slate-600">
        Solicitamos únicamente la información esencial para la finalización de la compra.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <input
          type="email"
          required
          placeholder="Correo electrónico *"
          value={value.email}
          onChange={(e) => patch({ email: e.target.value })}
          className={inputClass}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            required
            placeholder="Nombre *"
            value={value.nombre}
            onChange={(e) => patch({ nombre: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            required
            placeholder="Apellidos *"
            value={value.apellidos}
            onChange={(e) => patch({ apellidos: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <select
            value={value.tipoDocumento}
            onChange={(e) => patch({ tipoDocumento: e.target.value })}
            className={`${inputClass} appearance-none`}
            required
          >
            {DOC_TYPES.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            required
            placeholder="Número de documento *"
            value={value.numeroDocumento}
            onChange={(e) => patch({ numeroDocumento: e.target.value })}
            className={inputClass}
          />
        </div>
        <input
          type="tel"
          required
          placeholder="Número celular *"
          value={value.telefono}
          onChange={(e) => patch({ telefono: e.target.value })}
          className={inputClass}
        />
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={value.recibirNovedades}
            onChange={(e) => patch({ recibirNovedades: e.target.checked })}
            className="h-4 w-4 accent-red-600"
          />
          <span className="text-sm text-slate-700">
            Quiero recibir novedades con promociones
          </span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Guardar y continuar
        </button>
      </form>
    </div>
  );
}
