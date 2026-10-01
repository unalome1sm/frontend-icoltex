import departments from "./daneMunicipalities.json";

export type DaneMunicipality = {
  code: string;
  name: string;
};

export type DaneDepartment = {
  department: string;
  municipalities: DaneMunicipality[];
};

const DATA = departments as DaneDepartment[];

export function listDepartments(): DaneDepartment[] {
  return DATA;
}

export function municipalitiesForDepartment(department: string): DaneMunicipality[] {
  return DATA.find((item) => item.department === department)?.municipalities ?? [];
}
