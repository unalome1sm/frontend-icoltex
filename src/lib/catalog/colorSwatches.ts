/** Resultado visual de un nombre de color SAP (colorLabel). */
export type ColorSwatchStyle = {
  backgroundColor: string;
  /** Borde extra para tonos muy claros (blanco, crudo). */
  borderColor?: string;
  /** true si viene del diccionario; false si es hash estable de fallback. */
  mapped: boolean;
};

/** Reglas ordenadas: las más específicas primero. */
const COLOR_RULES: Array<{ match: (n: string) => boolean; hex: string; border?: string }> = [
  { match: (n) => n.includes("azul") && n.includes("marino"), hex: "#1e3a8a" },
  { match: (n) => n.includes("verde") && n.includes("oliva"), hex: "#4d7c0f" },
  { match: (n) => n.includes("verde") && n.includes("menta"), hex: "#6ee7b7" },
  { match: (n) => n.includes("azul") && n.includes("cielo"), hex: "#7dd3fc" },
  { match: (n) => n.includes("azul") && n.includes("rey"), hex: "#2563eb" },
  { match: (n) => n.includes("gris") && n.includes("perla"), hex: "#d1d5db" },
  { match: (n) => n.includes("lila") || n.includes("lavanda"), hex: "#c084fc" },
  { match: (n) => n.includes("violeta"), hex: "#8b5cf6" },
  { match: (n) => n.includes("morado") || n.includes("purpura"), hex: "#9333ea" },
  { match: (n) => n.includes("fucsia") || n.includes("magenta"), hex: "#d946ef" },
  { match: (n) => n.includes("turquesa") || n.includes("aqua"), hex: "#22d3ee" },
  { match: (n) => n.includes("celeste"), hex: "#38bdf8" },
  { match: (n) => n.includes("beige") || n.includes("arena") || n.includes("crema"), hex: "#fde68a", border: "#d6d3d1" },
  { match: (n) => n.includes("cafe") || n.includes("marron") || n.includes("chocolate"), hex: "#92400e" },
  { match: (n) => n.includes("vino") || n.includes("borgona") || n.includes("burdeos"), hex: "#7f1d1d" },
  { match: (n) => n.includes("mostaza"), hex: "#ca8a04" },
  { match: (n) => n.includes("dorado") || n.includes("oro"), hex: "#eab308" },
  { match: (n) => n.includes("plata") || n.includes("plateado"), hex: "#94a3b8" },
  { match: (n) => n.includes("blanco") || n.includes("crudo") || n.includes("natural"), hex: "#f5f5f4", border: "#d6d3d1" },
  { match: (n) => n.includes("gris") || n.includes("plomo") || n.includes("ceniza"), hex: "#94a3b8" },
  { match: (n) => n.includes("negro"), hex: "#171717" },
  { match: (n) => n.includes("rojo"), hex: "#dc2626" },
  { match: (n) => n.includes("verde"), hex: "#16a34a" },
  { match: (n) => n.includes("azul"), hex: "#3b82f6" },
  { match: (n) => n.includes("naranja"), hex: "#f97316" },
  { match: (n) => n.includes("amarillo"), hex: "#facc15" },
  { match: (n) => n.includes("rosa"), hex: "#f472b6" },
  { match: (n) => n.includes("coral"), hex: "#fb7185" },
  { match: (n) => n.includes("salmon"), hex: "#fda4af" },
  { match: (n) => n.includes("melocoton") || n.includes("durazno"), hex: "#fdba74" },
];

export function normalizeColorName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function stableHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Tono pastel estable para nombres no reconocidos (evita gris genérico para todos). */
function hashToPastelHex(normalized: string): string {
  const h = stableHash(normalized);
  const hue = h % 360;
  const sat = 45 + (h % 25);
  const light = 62 + (h % 12);
  return `hsl(${hue} ${sat}% ${light}%)`;
}

function matchSwatchFromNormalized(n: string): ColorSwatchStyle | null {
  for (const rule of COLOR_RULES) {
    if (rule.match(n)) {
      return { backgroundColor: rule.hex, borderColor: rule.border, mapped: true };
    }
  }
  for (const word of n.split(/[\s,/\-–—]+/)) {
    if (word.length <= 1) continue;
    for (const rule of COLOR_RULES) {
      if (rule.match(word)) {
        return { backgroundColor: rule.hex, borderColor: rule.border, mapped: true };
      }
    }
  }
  return null;
}

export function isColorMapped(name: string): boolean {
  const n = normalizeColorName(name);
  if (!n) return false;
  return matchSwatchFromNormalized(n) !== null;
}

export function colorNameToSwatchStyle(name: string, colorHex?: string): ColorSwatchStyle {
  const hex = colorHex?.trim();
  if (hex && /^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?([0-9A-Fa-f]{2})?$/.test(hex)) {
    const normalized = hex.startsWith("#") ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
    const isLight =
      normalized === "#FFFFFF" ||
      normalized === "#FAFAF7" ||
      normalized === "#FFF" ||
      /^#(F[8-9A-F]|E[8-9A-F])/i.test(normalized);
    return {
      backgroundColor: normalized,
      borderColor: isLight ? "#d6d3d1" : undefined,
      mapped: true,
    };
  }

  const n = normalizeColorName(name);
  if (!n) {
    return { backgroundColor: "#94a3b8", mapped: false };
  }

  const matched = matchSwatchFromNormalized(n);
  if (matched) return matched;

  return {
    backgroundColor: hashToPastelHex(n),
    mapped: false,
  };
}

/** @deprecated Use colorNameToSwatchStyle — mantiene compatibilidad si algo importaba colorNameToCss */
export function colorNameToCss(name: string): string {
  return colorNameToSwatchStyle(name).backgroundColor;
}

export type ColorAuditEntry = {
  name: string;
  mapped: boolean;
  swatch: string;
};

/** Audita una lista de colorLabel (p. ej. filter-meta.colores). */
export function auditColorLabels(colorNames: string[]): {
  mapped: ColorAuditEntry[];
  unmapped: ColorAuditEntry[];
} {
  const seen = new Set<string>();
  const mapped: ColorAuditEntry[] = [];
  const unmapped: ColorAuditEntry[] = [];

  for (const raw of colorNames) {
    const name = raw.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const style = colorNameToSwatchStyle(name);
    const entry: ColorAuditEntry = {
      name,
      mapped: style.mapped,
      swatch: style.backgroundColor,
    };
    if (style.mapped) mapped.push(entry);
    else unmapped.push(entry);
  }

  mapped.sort((a, b) => a.name.localeCompare(b.name, "es"));
  unmapped.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return { mapped, unmapped };
}
