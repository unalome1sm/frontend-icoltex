"use client";

import {
  listDepartments,
  municipalitiesForDepartment,
} from "@/lib/checkout";

export type DaneAddressValue = {
  departamento: string;
  ciudad: string;
  codigoDane: string;
  direccion: string;
};

const defaultInputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

type Props = {
  idPrefix: string;
  value: DaneAddressValue;
  onChange: (next: DaneAddressValue) => void;
  inputClassName?: string;
  required?: boolean;
};

export function DaneAddressFields({
  idPrefix,
  value,
  onChange,
  inputClassName,
  required = true,
}: Props) {
  const inputClass = inputClassName || defaultInputClass;
  const departments = listDepartments();
  const municipalities = municipalitiesForDepartment(value.departamento);
  const departmentKnown = departments.some((item) => item.department === value.departamento);

  function setDepartment(departamento: string) {
    onChange({
      ...value,
      departamento,
      ciudad: "",
      codigoDane: "",
    });
  }

  function setMunicipality(codigoDane: string) {
    const municipality = municipalities.find((item) => item.code === codigoDane);
    onChange({
      ...value,
      codigoDane,
      ciudad: municipality?.name || "",
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${idPrefix}-direccion`} className="mb-1 block text-xs font-medium text-slate-600">
          Dirección
        </label>
        <input
          id={`${idPrefix}-direccion`}
          type="text"
          required={required}
          value={value.direccion}
          onChange={(e) => onChange({ ...value, direccion: e.target.value })}
          placeholder="Calle, número, barrio"
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-departamento`} className="mb-1 block text-xs font-medium text-slate-600">
            Departamento
          </label>
          <select
            id={`${idPrefix}-departamento`}
            required={required}
            value={value.departamento}
            onChange={(e) => setDepartment(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Selecciona un departamento</option>
            {!departmentKnown && value.departamento ? (
              <option value={value.departamento}>{value.departamento}</option>
            ) : null}
            {departments.map((item) => (
              <option key={item.department} value={item.department}>
                {item.department}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-municipio`} className="mb-1 block text-xs font-medium text-slate-600">
            Municipio
          </label>
          <select
            id={`${idPrefix}-municipio`}
            required={required}
            value={value.codigoDane}
            onChange={(e) => setMunicipality(e.target.value)}
            disabled={!value.departamento}
            className={`${inputClass} appearance-none disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="">Selecciona un municipio</option>
            {municipalities.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {value.codigoDane ? (
        <p className="text-xs text-slate-500">Código DANE: {value.codigoDane}</p>
      ) : null}
    </div>
  );
}
