"use client";

import { DaneAddressFields } from "@/components/checkout/address";
import { DOCUMENT_TYPES, PERSON_TYPES, TAX_REGIMES, requiresVerificationDigit } from "@/lib/checkout";

export type FiscalProfileFieldsValue = {
  tipoDocumento?: string;
  numeroDocumento?: string;
  digitoVerificacion?: string;
  tipoPersona?: string;
  regimenTributario?: string;
  razonSocial?: string;
  movil?: string;
  emailCartera?: string;
  emailFacturacion?: string;
  direccionFacturacion?: string;
  ciudadFacturacion?: string;
  departamentoFacturacion?: string;
  codigoDaneFacturacion?: string;
  direccionEntrega?: string;
  ciudadEntrega?: string;
  departamentoEntrega?: string;
  codigoDaneEntrega?: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20";

type Props = {
  value: FiscalProfileFieldsValue;
  onChange: (field: keyof FiscalProfileFieldsValue, value: string) => void;
};

export function FiscalProfileFields({ value, onChange }: Props) {
  return (
    <div className="space-y-4 border-t border-slate-200 pt-6">
      <div>
        <h3 className="text-sm font-medium text-slate-900">Datos de facturación y entrega</h3>
        <p className="mt-1 text-xs text-slate-500">
          Opcionales aquí. En el checkout son obligatorios para pagar y se reutilizan si ya los guardaste.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Tipo de persona"
          value={value.tipoPersona || ""}
          onChange={(next) => onChange("tipoPersona", next)}
          options={PERSON_TYPES}
        />
        <Select
          label="Régimen tributario"
          value={value.regimenTributario || ""}
          onChange={(next) => onChange("regimenTributario", next)}
          options={TAX_REGIMES}
        />
        <Select
          label="Tipo de documento"
          value={value.tipoDocumento || ""}
          onChange={(next) => {
            onChange("tipoDocumento", next);
            if (!requiresVerificationDigit(next)) onChange("digitoVerificacion", "");
          }}
          options={DOCUMENT_TYPES}
        />
        <Field
          label="Número de documento"
          value={value.numeroDocumento || ""}
          onChange={(next) => onChange("numeroDocumento", next)}
          placeholder="Sin dígito de verificación"
        />
        {requiresVerificationDigit(value.tipoDocumento || "") ? (
          <Field
            label="Dígito de verificación"
            value={value.digitoVerificacion || ""}
            onChange={(next) => onChange("digitoVerificacion", next.replace(/\D/g, "").slice(0, 1))}
            placeholder="1 dígito"
          />
        ) : null}
        <Field
          label="Razón social"
          value={value.razonSocial || ""}
          onChange={(next) => onChange("razonSocial", next)}
          placeholder="Nombre o razón social"
        />
        <Field
          label="Móvil"
          value={value.movil || ""}
          onChange={(next) => onChange("movil", next.replace(/\D/g, ""))}
          placeholder="Solo números"
        />
        <Field
          label="Correo de cartera"
          value={value.emailCartera || ""}
          onChange={(next) => onChange("emailCartera", next)}
          placeholder="cartera@ejemplo.com"
          type="email"
        />
        <Field
          label="Correo de facturación electrónica"
          value={value.emailFacturacion || ""}
          onChange={(next) => onChange("emailFacturacion", next)}
          placeholder="facturacion@ejemplo.com"
          type="email"
        />
      </div>
      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">Dirección de facturación</h4>
        <DaneAddressFields
          idPrefix="profile-billing"
          required={false}
          inputClassName={inputClass}
          value={{
            direccion: value.direccionFacturacion || "",
            departamento: value.departamentoFacturacion || "",
            ciudad: value.ciudadFacturacion || "",
            codigoDane: value.codigoDaneFacturacion || "",
          }}
          onChange={(next) => {
            onChange("direccionFacturacion", next.direccion);
            onChange("departamentoFacturacion", next.departamento);
            onChange("ciudadFacturacion", next.ciudad);
            onChange("codigoDaneFacturacion", next.codigoDane);
          }}
        />
      </div>
      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">Dirección de entrega</h4>
        <DaneAddressFields
          idPrefix="profile-shipping"
          required={false}
          inputClassName={inputClass}
          value={{
            direccion: value.direccionEntrega || "",
            departamento: value.departamentoEntrega || "",
            ciudad: value.ciudadEntrega || "",
            codigoDane: value.codigoDaneEntrega || "",
          }}
          onChange={(next) => {
            onChange("direccionEntrega", next.direccion);
            onChange("departamentoEntrega", next.departamento);
            onChange("ciudadEntrega", next.ciudad);
            onChange("codigoDaneEntrega", next.codigoDane);
          }}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">Selecciona</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
