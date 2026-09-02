/** Minimal variant shape for commercial color grouping on the store PDP. */
export type ColorGroupableVariant = {
  codigo: string;
  colorLabel: string;
  colorHex?: string;
  itemNameCompleto: string;
  stock: number;
  activo?: boolean;
  precioMetro?: number;
  precioKilos?: number;
  tienePrecio?: boolean;
};

export type ColorSwatchOption = {
  colorLabel: string;
  colorHex?: string;
  /** Index into the original variantes[] of the winning SKU. */
  variantIndex: number;
};

function normalizeColorKey(label: string): string {
  return label.trim().toLocaleLowerCase("es");
}

/** Quality bucket labels from SAP (not commercial dye colors). */
export function isTipoQualityLabel(label: string): boolean {
  return /^tipo\s+[a-z]$/i.test(label.trim());
}

function isNoUtilizar(itemNameCompleto: string): boolean {
  return /^NO\s*UTILIZAR\b/i.test(itemNameCompleto.trim());
}

function hasPrice(v: ColorGroupableVariant): boolean {
  if (v.tienePrecio === false) return false;
  if (v.tienePrecio === true) return true;
  return (
    (v.precioMetro != null && !Number.isNaN(v.precioMetro)) ||
    (v.precioKilos != null && !Number.isNaN(v.precioKilos))
  );
}

function compareWinningVariants(a: ColorGroupableVariant, b: ColorGroupableVariant): number {
  const aActive = a.activo !== false ? 1 : 0;
  const bActive = b.activo !== false ? 1 : 0;
  if (aActive !== bActive) return bActive - aActive;

  const aUsable = isNoUtilizar(a.itemNameCompleto) ? 0 : 1;
  const bUsable = isNoUtilizar(b.itemNameCompleto) ? 0 : 1;
  if (aUsable !== bUsable) return bUsable - aUsable;

  const aPrice = hasPrice(a) ? 1 : 0;
  const bPrice = hasPrice(b) ? 1 : 0;
  if (aPrice !== bPrice) return bPrice - aPrice;

  if (a.stock !== b.stock) return b.stock - a.stock;

  return a.codigo.localeCompare(b.codigo);
}

export function pickWinningVariantIndex(group: { variant: ColorGroupableVariant; index: number }[]): number {
  if (group.length === 0) return -1;
  const sorted = [...group].sort((a, b) => compareWinningVariants(a.variant, b.variant));
  return sorted[0].index;
}

function hasStock(v: ColorGroupableVariant): boolean {
  return v.stock > 0;
}

/**
 * One swatch per commercial colorLabel with at least one SKU in stock.
 * Hides TIPO A/B/… quality labels. variantIndex points at the winning in-stock SKU.
 */
export function buildColorSwatches(variantes: ColorGroupableVariant[]): ColorSwatchOption[] {
  const buckets = new Map<string, { label: string; entries: { variant: ColorGroupableVariant; index: number }[] }>();

  variantes.forEach((variant, index) => {
    const label = variant.colorLabel?.trim();
    if (!label || isTipoQualityLabel(label) || !hasStock(variant)) return;

    const key = normalizeColorKey(label);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { label, entries: [] };
      buckets.set(key, bucket);
    }
    bucket.entries.push({ variant, index });
  });

  const swatches: ColorSwatchOption[] = [];

  for (const bucket of buckets.values()) {
    const winnerIndex = pickWinningVariantIndex(bucket.entries);
    if (winnerIndex < 0) continue;
    const winner = variantes[winnerIndex];
    const hex =
      winner.colorHex?.trim() ||
      bucket.entries.map((e) => e.variant.colorHex?.trim()).find(Boolean);

    swatches.push({
      colorLabel: bucket.label,
      colorHex: hex || undefined,
      variantIndex: winnerIndex,
    });
  }

  swatches.sort((a, b) =>
    a.colorLabel.localeCompare(b.colorLabel, "es", { sensitivity: "base" }),
  );

  return swatches;
}

/** Resolve the winning variant index for the commercial color of a given variant. */
export function resolveWinningIndexForVariant(
  variantes: ColorGroupableVariant[],
  variantIndex: number,
): number {
  const swatches = buildColorSwatches(variantes);
  if (!swatches.length) return Math.max(0, variantIndex);

  const current = variantes[variantIndex];
  if (!current) return swatches[0].variantIndex;

  if (isTipoQualityLabel(current.colorLabel ?? "")) {
    return swatches[0].variantIndex;
  }

  const key = normalizeColorKey(current.colorLabel ?? "");
  const match = swatches.find((s) => normalizeColorKey(s.colorLabel) === key);
  return match?.variantIndex ?? swatches[0].variantIndex;
}
