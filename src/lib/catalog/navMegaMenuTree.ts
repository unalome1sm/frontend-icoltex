/**
 * Árbol curado del mega menú (Figma ∩ filter-meta).
 * `match` = valor en catálogo (filtro2/filtro3); `display` = texto visible en el menú.
 * Orden: sectores (filtro2 / "Por sector") → prendas (filtro3 / "Por uso").
 */

export type NavMegaMenuTreeItem = {
  /** Label shown in the mega menu (Figma short/long form). */
  display: string;
  /** Value matched against filter-meta / used in shop query params. */
  match: string;
};

export type NavMegaMenuTreeEntry = {
  sectores: readonly NavMegaMenuTreeItem[];
  prendas: readonly NavMegaMenuTreeItem[];
  /** Optional right-panel image (public path or Drive URL). */
  imageSrc?: string;
};

function item(display: string, match: string = display): NavMegaMenuTreeItem {
  return { display, match };
}

/** Short display from a long catalog value (part before " / "). */
function shortItem(match: string): NavMegaMenuTreeItem {
  const slash = match.indexOf(" / ");
  return {
    display: slash >= 0 ? match.slice(0, slash) : match,
    match,
  };
}

export const NAV_MEGA_MENU_TREE = {
  antifluidos: {
    sectores: [
      item("Salud"),
      item("Educativo"),
      item("Farmacéutico", "Farmaceútico / Laboratorio"),
      item("Gastronómico"),
      item("Veterinario"),
      item("Odontológico"),
      item("Belleza"),
      item("Servicio general"),
      item("Quirúrgico", "Quirúrgico / Clínico"),
    ],
    prendas: [
      item("Batas"),
      item("Chaquetas", "Chaquetas / Chalecos"),
      item("Pantalonetas"),
      item("Polainas"),
      item("Delantales"),
      item("Pantalones"),
      item("Cofias"),
      item("Pijamas clínicas"),
      item("Tapabocas"),
      item("Sudaderas"),
      item("Bioseguridad"),
    ],
  },
  dotacion: {
    sectores: [
      item("Empresarial", "Empresarial / Administrativo"),
      item("Industrial"),
      item("Gastronómico"),
      item("Minero / Petrolero"),
      item("Colegial"),
      item("Comercial"),
      item("Construcción y obra"),
      item("Aeronáutico / Aeroportuario"),
      item("Seguridad y operativo"),
      item("Servicio general"),
      item("Logística y transporte"),
    ],
    prendas: [
      item("Blusas"),
      item("Overoles", "Overoles (piloto o dos piezas)"),
      item("Camisas y Camisetas"),
      item("Chalecos reflectivos"),
      item("Overoles de alta resistencia"),
      item("Pantalones y faldas"),
      item("Sastres"),
      item("Delantales"),
      item("Ropa de alta visibilidad"),
      item("Chaquetas / Chalecos"),
      item("Buzos"),
      item("Cuartos fríos"),
      item("Uniformes de carga", "Uniformes de carga / bodega"),
    ],
  },
  moda: {
    sectores: [
      item("Casual"),
      item("Resort"),
      item("Informal"),
      item("Infantil / Bebé"),
      item("Ejecutiva"),
    ],
    prendas: [
      item("Chaquetas / Chalecos"),
      item("Blusas"),
      item("Pijamas"),
      item("Denim"),
      item("Ropa infantil"),
      item("Faldas"),
      item("Vestidos"),
      item("Calzado"),
      item("Pantalonetas"),
      item("Accesorios textiles"),
      item("Pantalones"),
      item("Camisas y Camisetas"),
      item("Sastres"),
      item("Trajes de baño"),
    ],
  },
  hogar: {
    sectores: [
      item("Lencería hogar"),
      item("Hotelería y hospitalidad"),
      item("Tapicería"),
      item("Spa / Bienestar"),
      item("Decoración"),
      item("Restaurante y catering"),
    ],
    prendas: [
      item("Sábanas"),
      item("Manteles"),
      item("Ropa de cama hotelera"),
      item("Cobijas"),
      item("Cortinas"),
      item("Individuales y caminos de mesa"),
      item("Forros"),
      item("Toallas y textiles de baño"),
      item("Fundas y cojines decorativos"),
    ],
  },
  publicidad: {
    sectores: [
      item("Evento"),
      item("Entretenimiento"),
      item("Producción audiovisual"),
      item("Dotación comercial"),
      item("ONG y fundación"),
      item("Agencia de publicidad"),
    ],
    prendas: [
      item("Gorras"),
      item("Disfraces"),
      item("Mangas"),
      item("Delantales de marca"),
      item("Banderas / banderines"),
      item("Chaquetas / Chalecos"),
      item("Petos / bibs promocionales"),
      item("Pulseras y accesorios textiles de evento"),
      item("Totebags"),
      item("Camisas y Camisetas"),
      item("Mochilas y maletines textiles"),
    ],
  },
  deportivo: {
    sectores: [
      item("Uniforme deportivo"),
      item("Training / Fitness"),
      item("Outdoor / Aventura"),
      item("Dotación deportiva"),
      item("Federación y liga oficial"),
      item("Equipo y escuela deportiva"),
      item("Marca propia / Private label"),
    ],
    prendas: [
      item("Hoodies"),
      item("Camisetas"),
      item("Vestido de baño"),
      item("Uniformes de artes marciales"),
      item("Sudaderas"),
      item("Chaquetas"),
      item("Ropa de ciclismo"),
      item("Conjuntos deportivos"),
      item("Pantalonetas"),
      item("Trajes de natación / acuáticos"),
    ],
  },
} as const satisfies Record<string, NavMegaMenuTreeEntry>;
