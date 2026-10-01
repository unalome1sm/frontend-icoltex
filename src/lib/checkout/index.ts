export {
  DOCUMENT_TYPES,
  PERSON_TYPES,
  TAX_REGIMES,
  NIT_DOCUMENT_CODE,
  NATURAL_PERSON_CODE,
  isDocumentType,
  isPersonType,
  isTaxRegime,
  requiresVerificationDigit,
  isNaturalPerson,
} from "./fiscalCatalog";

export {
  listDepartments,
  municipalitiesForDepartment,
  type DaneDepartment,
  type DaneMunicipality,
} from "./daneMunicipalities";
