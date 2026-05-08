"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

type Store = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  status?: string;
  googleMapsUrl?: string;
  videoGuideUrl?: string;
};

type StoreHoursRow = {
  day: string;
  hours: string;
};

const DEFAULT_HOURS: StoreHoursRow[] = [
  { day: "Lunes", hours: "10:00 - 19:00" },
  { day: "Martes", hours: "10:00 - 19:00" },
  { day: "Miércoles", hours: "10:00 - 19:00" },
  { day: "Jueves", hours: "10:00 - 19:00" },
  { day: "Viernes", hours: "10:00 - 19:00" },
  { day: "Sábado", hours: "10:00 - 19:00" },
  { day: "Domingo", hours: "Cerrado" },
];

const STORES: Store[] = [
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

const CITIES = [
  { value: "", label: "Selecciona una ciudad" },
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
  { value: "pereira", label: "Pereira" },
];

function cityLabel(value: string) {
  return CITIES.find((c) => c.value === value)?.label ?? value;
}

function toDrivePreviewUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (!match) return url;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

function getDirectionsUrl(store: Store) {
  if (store.googleMapsUrl) return store.googleMapsUrl;
  const q = encodeURIComponent(`${store.address}, ${cityLabel(store.city)}, Colombia`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function StoreDetailPanel({
  store,
  onClose,
  onOpenVideo,
}: {
  store: Store;
  onClose: () => void;
  onOpenVideo: () => void;
}) {
  const title = `${store.name} - ${cityLabel(store.city)}`;
  const directionsUrl = getDirectionsUrl(store);

  return (
    <div className="absolute left-4 top-4 z-10 w-[min(92%,22rem)] rounded-xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          {store.status ? (
            <p className="mt-0.5 text-xs text-slate-500">{store.status}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Cómo llegar
        </a>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          onClick={onOpenVideo}
        >
          Video guía
        </button>
      </div>

      <div className="px-4 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
          Galería
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] w-full rounded-md border border-slate-200 bg-slate-100"
              aria-label="Imagen de la tienda"
            />
          ))}
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Dirección
            </p>
            <p className="mt-1">{store.address}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Horario
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {DEFAULT_HOURS.map((row) => (
                <div key={row.day} className="contents">
                  <span className="text-slate-600">{row.day}</span>
                  <span className="text-slate-900">{row.hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
              Teléfono
            </p>
            <p className="mt-1">{store.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoGuideModal({
  open,
  title,
  videoUrl,
  onClose,
}: {
  open: boolean;
  title: string;
  videoUrl: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Cerrar video guía"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          {videoUrl ? (
            <div className="aspect-[9/16] w-full overflow-hidden rounded-xl border border-slate-200 bg-black">
              <iframe
                title={title}
                src={videoUrl}
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Próximamente</p>
              <p className="mt-2 leading-relaxed">
                Próximamente te mostraremos una guía de llegada a nuestra tienda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StoresPageContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("ciudad") ?? "";
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (cityParam && CITIES.some((c) => c.value === cityParam)) {
      setSelectedCity(cityParam);
    }
  }, [cityParam]);

  const filteredStores = useMemo(() => {
    if (!selectedCity) return STORES;
    return STORES.filter((s) => s.city === selectedCity);
  }, [selectedCity]);

  const selectedStore = useMemo(() => {
    if (!selectedStoreId) return null;
    return filteredStores.find((s) => s.id === selectedStoreId) ?? null;
  }, [filteredStores, selectedStoreId]);

  useEffect(() => {
    if (selectedStoreId && !filteredStores.some((s) => s.id === selectedStoreId)) {
      setSelectedStoreId(null);
    }
  }, [filteredStores, selectedStoreId]);

  useEffect(() => {
    if (!selectedStore) setVideoOpen(false);
  }, [selectedStore]);

  return (
    <div className="min-h-screen">
      {/* Pegado a la barra de promoción (como el banner del home: -mt-8) */}
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="relative flex min-h-[320px] w-full flex-col items-center justify-center overflow-hidden bg-red-600 px-6 text-center md:min-h-[420px] md:px-10">
          <div
            className="absolute inset-0 opacity-20"
            aria-hidden
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q50 30 30 55 Q10 30 30 5' fill='none' stroke='white' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M5 30 Q30 10 55 30 Q30 50 5 30' fill='none' stroke='white' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
            }}
          />
          <h1 className="relative text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nuestras Tiendas
          </h1>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/95">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </p>
        </div>
      </section>

      {/* Fila de dos columnas: Buscador | Mapa */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Columna izquierda: Buscador de tiendas */}
          <div className="min-w-0 flex-1 lg:max-w-md">
            <h2 className="text-xl font-bold text-slate-900">
              Buscador de tiendas
            </h2>
            <div className="mt-4">
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  aria-label="Selecciona una ciudad"
                >
                  {CITIES.map((c) => (
                    <option key={c.value || "all"} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden
                />
              </div>
            </div>
            <div className="mt-4 max-h-[60vh] space-y-0 overflow-y-auto rounded-lg border border-slate-200">
              {filteredStores.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No hay tiendas en esta ciudad.
                </div>
              ) : (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedStoreId(store.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedStoreId(store.id);
                    }}
                    className={[
                      "cursor-pointer border-b border-slate-100 bg-white p-4 last:border-b-0",
                      "hover:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-red-500/40",
                      selectedStoreId === store.id ? "bg-red-50" : "",
                    ].join(" ")}
                  >
                    <p className="font-semibold text-slate-900">{store.name}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{store.phone}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{store.address}</p>
                    <p className="mt-1 text-sm font-medium text-red-600">
                      {store.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Columna derecha: Mapa */}
          <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
            {selectedStore && (
              <StoreDetailPanel
                store={selectedStore}
                onClose={() => setSelectedStoreId(null)}
                onOpenVideo={() => setVideoOpen(true)}
              />
            )}
            {selectedStore ? (
              <VideoGuideModal
                open={videoOpen}
                title={`Video guía · ${selectedStore.name} - ${cityLabel(selectedStore.city)}`}
                videoUrl={
                  selectedStore.videoGuideUrl
                    ? toDrivePreviewUrl(selectedStore.videoGuideUrl)
                    : null
                }
                onClose={() => setVideoOpen(false)}
              />
            ) : null}
            <iframe
              title="Mapa de tiendas"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.15%2C4.60%2C-74.05%2C4.70&layer=mapnik&marker=4.6516,-74.0997"
              className="h-full min-h-[400px] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
