import {
  CITIES,
  STORES,
  cityLabel,
  normalizeStoreSearchQuery,
} from "@/data/stores";
import {
  DEFAULT_SHOP_FILTERS,
  shopFiltersToSearchParams,
  type CatalogFilterMeta,
} from "./shopFilters";

export type NavSearchStoreSuggestion = {
  kind: "store";
  id: string;
  label: string;
  subtitle?: string;
  href: string;
};

export type NavSearchProductSuggestion = {
  kind: "product";
  id: string;
  label: string;
  href: string;
};

export type NavSearchSuggestion =
  | NavSearchStoreSuggestion
  | NavSearchProductSuggestion;

const CITY_OPTIONS = CITIES.filter((c) => c.value !== "");
const MAX_STORES = 5;
const MAX_PRODUCTS = 5;

function shopUrlForProductName(nombre: string): string {
  const filters = { ...DEFAULT_SHOP_FILTERS, nombre: nombre.trim() };
  const qs = shopFiltersToSearchParams(filters).toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function uniqueProductNames(meta: CatalogFilterMeta | null): string[] {
  if (!meta?.productosByLinea) return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const list of Object.values(meta.productosByLinea)) {
    for (const name of list) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      const key = normalizeStoreSearchQuery(trimmed);
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(trimmed);
    }
  }
  return names;
}

function matchesQuery(haystack: string, normalizedQuery: string): boolean {
  return normalizeStoreSearchQuery(haystack).includes(normalizedQuery);
}

/**
 * Local autocomplete suggestions for the navbar search (stores + product names).
 */
export function getNavSearchSuggestions(
  query: string,
  meta: CatalogFilterMeta | null,
): { stores: NavSearchStoreSuggestion[]; products: NavSearchProductSuggestion[] } {
  const normalized = normalizeStoreSearchQuery(query);
  if (normalized.length < 2) {
    return { stores: [], products: [] };
  }

  const stores: NavSearchStoreSuggestion[] = [];

  for (const city of CITY_OPTIONS) {
    if (
      matchesQuery(city.label, normalized) ||
      matchesQuery(city.value, normalized)
    ) {
      stores.push({
        kind: "store",
        id: `city:${city.value}`,
        label: city.label,
        subtitle: "Puntos de venta",
        href: `/stores?ciudad=${encodeURIComponent(city.value)}`,
      });
    }
    if (stores.length >= MAX_STORES) break;
  }

  if (stores.length < MAX_STORES) {
    for (const store of STORES) {
      if (
        !matchesQuery(store.name, normalized) &&
        !matchesQuery(store.address, normalized)
      ) {
        continue;
      }
      stores.push({
        kind: "store",
        id: store.id,
        label: store.name,
        subtitle: cityLabel(store.city),
        href: `/stores?ciudad=${encodeURIComponent(store.city)}&tienda=${encodeURIComponent(store.id)}`,
      });
      if (stores.length >= MAX_STORES) break;
    }
  }

  const products: NavSearchProductSuggestion[] = [];
  for (const name of uniqueProductNames(meta)) {
    if (!matchesQuery(name, normalized)) continue;
    products.push({
      kind: "product",
      id: `product:${normalizeStoreSearchQuery(name)}`,
      label: name,
      href: shopUrlForProductName(name),
    });
    if (products.length >= MAX_PRODUCTS) break;
  }

  return { stores, products };
}

export function flattenNavSearchSuggestions(groups: {
  stores: NavSearchStoreSuggestion[];
  products: NavSearchProductSuggestion[];
}): NavSearchSuggestion[] {
  return [...groups.stores, ...groups.products];
}
