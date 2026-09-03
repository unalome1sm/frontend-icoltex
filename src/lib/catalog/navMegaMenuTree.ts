/**
 * Árbol curado del mega menú (ICOLTEX Árbol de Navegación).
 * Solo ítems del Word que existen en el catálogo (JSON / filter-meta).
 * Orden: sectores (filtro2) → prendas (filtro3).
 */
export type NavMegaMenuTreeEntry = {
  sectores: readonly string[];
  prendas: readonly string[];
};

export const NAV_MEGA_MENU_TREE = {
  antifluidos: {
    sectores: [
      "Salud",
      "Gastronómico",
      "Belleza",
      "Educativo",
      "Veterinario",
      "Servicio general",
      "Farmacéutico / Laboratorio",
      "Odontológico",
      "Quirúrgico / Clínico",
    ],
    prendas: [
      "Batas",
      "Delantales",
      "Tapabocas",
      "Chaquetas / Chalecos",
      "Pantalones",
      "Sudaderas",
      "Pantalonetas",
      "Cofias",
      "Bioseguridad",
      "Polainas",
      "Pijamas clínicas",
    ],
  },
  dotacion: {
    sectores: [
      "Empresarial / Administrativo",
      "Colegial",
      "Seguridad y operativo",
      "Industrial",
      "Comercial",
      "Servicio general",
      "Gastronómico",
      "Construcción y obra",
      "Logística y transporte",
      "Minero / Petrolero",
      "Aeronáutico / Aeroportuario",
    ],
    prendas: [
      "Blusas",
      "Pantalones y faldas",
      "Chaquetas / Chalecos",
      "Overoles (piloto o dos piezas)",
      "Sastres",
      "Buzos",
      "Camisas y Camisetas",
      "Delantales",
      "Chalecos reflectivos",
      "Ropa de alta visibilidad",
      "Uniformes de carga / bodega",
      "Overoles de alta resistencia",
    ],
  },
  moda: {
    sectores: ["Casual", "Informal", "Ejecutiva", "Resort", "Infantil / Bebé"],
    prendas: [
      "Chaquetas / Chalecos",
      "Faldas",
      "Pantalones",
      "Blusas",
      "Vestidos",
      "Camisas y Camisetas",
      "Pijamas",
      "Calzado",
      "Sastres",
      "Denim",
      "Pantalonetas",
      "Trajes de baño",
      "Ropa infantil",
    ],
  },
  hogar: {
    sectores: [
      "Lencería hogar",
      "Tapicería",
      "Decoración",
      "Hotelería y hospitalidad",
      "Spa / Bienestar",
      "Restaurante y catering",
    ],
    prendas: [
      "Sábanas",
      "Cobijas",
      "Forros",
      "Manteles",
      "Cortinas",
      "Toallas y textiles de baño",
      "Ropa de cama hotelera",
      "Fundas y cojines decorativos",
    ],
  },
  publicidad: {
    sectores: [
      "Evento",
      "Dotación comercial",
      "Agencia de publicidad",
      "Entretenimiento / Producción audiovisual",
    ],
    prendas: [
      "Gorras",
      "Banderas / banderines",
      "Totebags",
      "Disfraces",
      "Chaquetas / Chalecos",
      "Camisas y Camisetas",
      "Mochilas y maletines textiles",
    ],
  },
  deportivo: {
    sectores: [
      "Uniforme deportivo",
      "Dotación deportiva",
      "Equipo y escuela deportiva",
      "Training / Fitness",
      "Federación y liga oficial",
      "Marca propia / Private label",
      "Outdoor / Aventura",
    ],
    prendas: [
      "Hoodies",
      "Sudaderas",
      "Conjuntos deportivos",
      "Camisetas",
      "Chaquetas",
      "Pantalonetas",
      "Vestido de baño",
      "Ropa de ciclismo",
      "Trajes de natación / acuáticos",
    ],
  },
} as const satisfies Record<string, NavMegaMenuTreeEntry>;
