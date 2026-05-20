export type Store = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  status?: string;
  googleMapsUrl?: string;
  videoGuideUrl?: string;
  /** Coordenadas opcionales; si faltan, el mapa geocodifica la dirección */
  lat?: number;
  lng?: number;
};

export const STORES: Store[] = [
  {
    id: "bogota-alqueria-1",
    name: "Alquería",
    phone: "(322) 208-8441",
    address: "Cl. 42b Sur #52b-16",
    city: "bogota",
    googleMapsUrl: "https://share.google/gIqpy1U9cUnRvW5TD",
    videoGuideUrl:
      "https://drive.google.com/file/d/1P3jVcNkFPCISrxzSF991FIjrE4UcR91b/preview",
  },
  {
    id: "bogota-alqueria-2",
    name: "Alquería 2",
    phone: "(310) 232-6761",
    address: "Cra. 52c #41-36 Sur",
    city: "bogota",
    googleMapsUrl: "https://share.google/zT2P4XQw8r8FGrF8H",
    videoGuideUrl:
      "https://drive.google.com/file/d/1sz0QD5MuJUT8_pJdWNE_07UTeP_SyHqx/preview",
  },
  {
    id: "bogota-policarpa",
    name: "Policarpa",
    phone: "(321) 436-5427",
    address: "Cl. 3 Sur #12A-18",
    city: "bogota",
    googleMapsUrl: "https://share.google/7Wc2T75GQy3saLPwn",
    videoGuideUrl:
      "https://drive.google.com/file/d/10d7zYA4qZ028K90gpuv9sDCVkDgvRo_o/preview",
  },
  {
    id: "bogota-restrepo",
    name: "Restrepo",
    phone: "(310) 726-8655",
    address: "Cra. 24C #17-48 Sur",
    city: "bogota",
    googleMapsUrl: "https://share.google/c1H0AJlDWcqEhTnHr",
    videoGuideUrl:
      "https://drive.google.com/file/d/1ZeoTEdraVhUxfu48uWc1AbvO0C4_7ExV/preview",
  },
  {
    id: "bogota-centro-1",
    name: "Centro 1",
    phone: "(312) 328-0780",
    address: "Cra. 13 #17-60",
    city: "bogota",
    googleMapsUrl: "https://share.google/7HrYtW0Rjs3VpvRZ2",
    videoGuideUrl:
      "https://drive.google.com/file/d/1ggy5yRZG-Z9QtLLvuVShX7NQSO4bRoU6/preview",
  },
  {
    id: "medellin-principal",
    name: "Principal",
    phone: "(310) 256-0796",
    address: "Cl. 49 #53-76",
    city: "medellin",
    googleMapsUrl: "https://share.google/iDnue3illCto8FtnI",
  },
  {
    id: "medellin-ayacucho",
    name: "Ayacucho",
    phone: "(310) 256-0842",
    address: "Cl. 49 #54-70",
    city: "medellin",
    googleMapsUrl: "https://share.google/NfOSPVRi4aWYuU7bL",
  },
  {
    id: "medellin-la-54",
    name: "La 54",
    phone: "(312) 561-8463",
    address: "Cra. 54 #48-75",
    city: "medellin",
    googleMapsUrl: "https://share.google/gNicvGnY8v9jG2nia",
  },
  {
    id: "cali-principal",
    name: "Principal",
    phone: "(310) 842-5564",
    address: "Cra. 8 #15-32",
    city: "cali",
    googleMapsUrl: "https://share.google/67gYADYVc2C6shdoH",
    videoGuideUrl:
      "https://drive.google.com/file/d/17mtxA3BFxjKbh0V5jnvcqQdWSmdbRAmF/preview",
  },
  {
    id: "cali-2",
    name: "Cali 2",
    phone: "(321) 474-7156",
    address: "Cra. 7 #11-1",
    city: "cali",
    googleMapsUrl: "https://share.google/75TC30CHOwFVBLQTe",
    videoGuideUrl:
      "https://drive.google.com/file/d/1liLMg28WDxO0JLQKb5GLahMbRWvxYqG-/preview",
  },
  {
    id: "barranquilla-principal",
    name: "Principal",
    phone: "322 836-8622",
    address: "Cl. 32 #43-86",
    city: "barranquilla",
    googleMapsUrl: "https://share.google/wrG5JGhqQC1UsaKOl",
  },
  {
    id: "pereira-principal",
    name: "Principal",
    phone: "(321) 437-8115",
    address: "Cra. 6 #14-31",
    city: "pereira",
    googleMapsUrl: "https://share.google/tbPtgSg3q3Wo7pASa",
    videoGuideUrl:
      "https://drive.google.com/file/d/1Ny4KEqTtulCeG_vBYGg4EjhrQvCRpAZS/preview",
  },
];

export const CITIES = [
  { value: "", label: "Selecciona una ciudad" },
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
  { value: "pereira", label: "Pereira" },
] as const;

export const CITY_CENTERS: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  bogota: { lat: 4.6097, lng: -74.0817, zoom: 12 },
  medellin: { lat: 6.2476, lng: -75.5658, zoom: 13 },
  cali: { lat: 3.4516, lng: -76.532, zoom: 13 },
  barranquilla: { lat: 10.9685, lng: -74.7813, zoom: 13 },
  pereira: { lat: 4.8133, lng: -75.6961, zoom: 14 },
};

export const COLOMBIA_CENTER = { lat: 4.5709, lng: -74.2973, zoom: 6 };

export function cityLabel(value: string) {
  return CITIES.find((c) => c.value === value)?.label ?? value;
}

export function getStoreFullAddress(store: Store) {
  return `${store.address}, ${cityLabel(store.city)}, Colombia`;
}
