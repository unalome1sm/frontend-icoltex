"use client";

import {
  DOCUMENT_TYPES,
  PERSON_TYPES,
  TAX_REGIMES,
  isNaturalPerson,
  requiresVerificationDigit,
} from "@/lib/checkout";
import type { PersonalData } from "../orderSnapshot";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

type Props = {
  value: PersonalData;
  error: string | null;
  onChange: (next: PersonalData) => void;
  onSubmit: () => void;
};

export function CheckoutIdentityForm({ value, error, onChange, onSubmit }: Props) {
  function patch(partial: Partial<PersonalData>) {
    onChange({ ...value, ...partial });
  }

  const natural = isNaturalPerson(value.tipoPersona);
  const showVerificationDigit = requiresVerificationDigit(value.tipoDocumento);

  return (
    <div className="border-t border-slate-200 px-5 pb-5 pt-2">
      <p className="mb-4 text-sm text-slate-600">
        Estos datos se usan para identificarte, facturar y crear el cliente.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Tipo de persona"
            value={value.tipoPersona}
            onChange={(tipoPersona) => patch({ tipoPersona })}
            options={PERSON_TYPES}
          />
          <SelectField
            label="Régimen tributario"
            value={value.regimenTributario}
            onChange={(regimenTributario) => patch({ regimenTributario })}
            options={TAX_REGIMES}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Tipo de documento"
            value={value.tipoDocumento}
            onChange={(tipoDocumento) =>
              patch({
                tipoDocumento,
                digitoVerificacion: requiresVerificationDigit(tipoDocumento)
                  ? value.digitoVerificacion
                  : "",
              })
            }
            options={DOCUMENT_TYPES}
          />
          <TextField
            label="Número de documento"
            value={value.numeroDocumento}
            onChange={(numeroDocumento) => patch({ numeroDocumento })}
            placeholder="Sin dígito de verificación"
          />
        </div>
        {showVerificationDigit ? (
          <TextField
            label="Dígito de verificación"
            value={value.digitoVerificacion}
            onChange={(digitoVerificacion) =>
              patch({ digitoVerificacion: digitoVerificacion.replace(/\D/g, "").slice(0, 1) })
            }
            placeholder="1 dígito"
            inputMode="numeric"
          />
        ) : null}
        {value.tipoPersona ? (
          natural ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre"
              value={value.nombre}
              onChange={(nombre) => patch({ nombre })}
              placeholder="Nombre"
            />
            <TextField
              label="Apellidos"
              value={value.apellidos}
              onChange={(apellidos) => patch({ apellidos })}
              placeholder="Apellidos"
            />
          </div>
        ) : (
          <TextField
            label="Razón social"
            value={value.razonSocial}
            onChange={(razonSocial) => patch({ razonSocial })}
            placeholder="Razón social"
          />
          )
        ) : null}
        <TextField
          label="Móvil"
          value={value.movil}
          onChange={(movil) => patch({ movil: movil.replace(/\D/g, "") })}
          placeholder="Número celular"
          inputMode="tel"
        />
        <Checkbox
          checked={value.telefonoIgualMovil}
          onChange={(telefonoIgualMovil) => patch({ telefonoIgualMovil })}
          label="El teléfono es el mismo número"
        />
        {!value.telefonoIgualMovil ? (
          <TextField
            label="Teléfono"
            value={value.telefono}
            onChange={(telefono) => patch({ telefono: telefono.replace(/\D/g, "") })}
            placeholder="Teléfono fijo"
            inputMode="tel"
          />
        ) : null}
        <TextField
          label="Correo electrónico"
          type="email"
          value={value.email}
          onChange={(email) => patch({ email })}
          placeholder="correo@ejemplo.com"
        />
        <Checkbox
          checked={value.emailCarteraIgual}
          onChange={(emailCarteraIgual) => patch({ emailCarteraIgual })}
          label="Usar el mismo correo para notificaciones de cartera"
        />
        {!value.emailCarteraIgual ? (
          <TextField
            label="Correo de cartera"
            type="email"
            value={value.emailCartera}
            onChange={(emailCartera) => patch({ emailCartera })}
            placeholder="cartera@ejemplo.com"
          />
        ) : null}
        <Checkbox
          checked={value.emailFacturacionIgual}
          onChange={(emailFacturacionIgual) => patch({ emailFacturacionIgual })}
          label="Usar el mismo correo para facturación electrónica"
        />
        {!value.emailFacturacionIgual ? (
          <TextField
            label="Correo de facturación electrónica"
            type="email"
            value={value.emailFacturacion}
            onChange={(emailFacturacion) => patch({ emailFacturacion })}
            placeholder="facturacion@ejemplo.com"
          />
        ) : null}
        <Checkbox
          checked={value.recibirNovedades}
          onChange={(recibirNovedades) => patch({ recibirNovedades })}
          label="Quiero recibir novedades con promociones"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
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

function SelectField({
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
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none`}
      >
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email";
  inputMode?: "numeric" | "tel";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        required
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-red-600"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
