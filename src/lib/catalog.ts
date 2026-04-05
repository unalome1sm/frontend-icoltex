import { apiFetch } from "./api";

/** Terna del webhook Tangara (normalizada en el backend). */
export type ItemCharacteristic = {
  clase: string;
  categoria: string;
  color: string;
};

export type ItemCharacteristicsResponse = {
  count: number;
  items: ItemCharacteristic[];
};

const path = "/api/catalog/item-characteristics";

export async function fetchItemCharacteristics(): Promise<ItemCharacteristicsResponse> {
  return apiFetch<ItemCharacteristicsResponse>(path, { method: "GET" });
}

function sortEs(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b, "es"));
}

/** Clases distintas (ordenadas). */
export function distinctClases(items: ItemCharacteristic[]): string[] {
  const set = new Set(items.map((i) => i.clase).filter(Boolean));
  return sortEs([...set]);
}

/** Categorías que existen para una clase. */
export function categoriasForClase(
  items: ItemCharacteristic[],
  clase: string
): string[] {
  const norm = clase.trim();
  const set = new Set(
    items
      .filter((i) => i.clase === norm)
      .map((i) => i.categoria)
      .filter(Boolean)
  );
  return sortEs([...set]);
}

/** Colores válidos para la pareja clase + categoría. */
export function coloresForClaseCategoria(
  items: ItemCharacteristic[],
  clase: string,
  categoria: string
): string[] {
  const c = clase.trim();
  const cat = categoria.trim();
  const set = new Set(
    items
      .filter((i) => i.clase === c && i.categoria === cat)
      .map((i) => i.color)
      .filter(Boolean)
  );
  return sortEs([...set]);
}
