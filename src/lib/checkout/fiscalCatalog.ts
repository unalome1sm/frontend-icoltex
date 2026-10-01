export const DOCUMENT_TYPES = [
  { value: "13", label: "Cédula de ciudadanía" },
  { value: "11", label: "Registro civil" },
  { value: "12", label: "Tarjeta de identidad" },
  { value: "21", label: "Tarjeta de extranjería" },
  { value: "31", label: "NIT" },
  { value: "41", label: "Pasaporte" },
  { value: "42", label: "Tipo de documento extranjero" },
  { value: "43", label: "Doc. para información exógena" },
  { value: "48", label: "Permiso de protección temporal" },
] as const;

export const PERSON_TYPES = [
  { value: "01", label: "Persona natural" },
  { value: "02", label: "Persona jurídica" },
  { value: "03", label: "Gran contribuyente" },
] as const;

export const TAX_REGIMES = [
  { value: "RC", label: "Régimen común" },
  { value: "RS", label: "Régimen simplificado" },
  { value: "RSIMPLE", label: "Régimen simple" },
] as const;

export const NIT_DOCUMENT_CODE = "31";
export const NATURAL_PERSON_CODE = "01";

const DOCUMENT_CODES = new Set<string>(DOCUMENT_TYPES.map((item) => item.value));
const PERSON_CODES = new Set<string>(PERSON_TYPES.map((item) => item.value));
const REGIME_CODES = new Set<string>(TAX_REGIMES.map((item) => item.value));

export function isDocumentType(value: string): boolean {
  return DOCUMENT_CODES.has(value);
}

export function isPersonType(value: string): boolean {
  return PERSON_CODES.has(value);
}

export function isTaxRegime(value: string): boolean {
  return REGIME_CODES.has(value);
}

export function requiresVerificationDigit(tipoDocumento: string): boolean {
  return tipoDocumento === NIT_DOCUMENT_CODE;
}

export function isNaturalPerson(tipoPersona: string): boolean {
  return tipoPersona === NATURAL_PERSON_CODE;
}
