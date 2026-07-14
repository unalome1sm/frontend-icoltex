"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, MapPin, Navigation, Phone, X } from "lucide-react";
import {
  CITIES,
  STORES,
  buildStoreDirectionsUrl,
  cityLabel,
  type Store,
} from "@/data/stores";
import { StoresMap } from "@/components/stores/StoresMap";

const HERO_IMAGE = "/media/banner/DSC02694.webp";

const CITY_FILTERS = CITIES.filter((c) => c.value !== "");

function phoneToWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("57") ? digits : `57${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent("Hola, quisiera información sobre el punto de venta Icoltex.")}`;
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone.startsWith("+") ? phone : `+57 ${phone}`;
}

function openDirections(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function toDrivePreviewUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (!match) return url;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
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

export function StoresPuntosVentaPage() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("ciudad") ?? "";

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const handleLoadRoute = useCallback((store: Store) => {
    setRouteError(null);

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setRouteError(
        "Tu navegador no permite geolocalización. Abrimos Google Maps con el destino de la tienda.",
      );
      openDirections(buildStoreDirectionsUrl(store));
      return;
    }

    setRouteLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRouteLoading(false);
        openDirections(
          buildStoreDirectionsUrl(store, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        );
      },
      () => {
        setRouteLoading(false);
        setRouteError(
          "No pudimos obtener tu ubicación. Abrimos Google Maps para que indiques el punto de partida.",
        );
        openDirections(buildStoreDirectionsUrl(store));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 },
    );
  }, []);

  useEffect(() => {
    if (cityParam && CITY_FILTERS.some((c) => c.value === cityParam)) {
      setSelectedCity(cityParam);
    }
  }, [cityParam]);

  const filteredStores = useMemo(() => {
    if (!selectedCity) return STORES;
    return STORES.filter((s) => s.city === selectedCity);
  }, [selectedCity]);

  const selectedStore = useMemo(() => {
    if (selectedStoreId) {
      return filteredStores.find((s) => s.id === selectedStoreId) ?? filteredStores[0] ?? null;
    }
    return filteredStores[0] ?? null;
  }, [filteredStores, selectedStoreId]);

  /** Estable entre renders: evita reiniciar geocoding en StoresMap */
  const mapStores = useMemo(
    () => (selectedStore ? [selectedStore] : []),
    [selectedStore],
  );

  useEffect(() => {
    if (filteredStores.length === 0) {
      setSelectedStoreId(null);
      return;
    }
    if (!selectedStoreId || !filteredStores.some((s) => s.id === selectedStoreId)) {
      setSelectedStoreId(filteredStores[0].id);
    }
  }, [filteredStores, selectedStoreId]);

  useEffect(() => {
    setVideoOpen(false);
    setRouteError(null);
  }, [selectedStore?.id]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden bg-red-600 px-6 py-14 text-center md:min-h-[320px] md:px-10">
          <div
            className="absolute inset-0 opacity-15"
            aria-hidden
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q50 30 30 55 Q10 30 30 5' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />
          <h1 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Nuestros Puntos de Venta
          </h1>
          <p className="relative mx-auto mt-4 max-w-2xl text-base text-white/95 sm:text-lg">
            Encuéntranos en estas ciudades — te atendemos con gusto en cada punto físico.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filtro por ciudad (pills) */}
        <p className="text-sm font-medium text-slate-600">Filtrar por ciudad:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCity("")}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedCity === ""
                ? "border-red-600 bg-red-600 text-white"
                : "border-red-600 bg-white text-red-600 hover:bg-red-50"
            }`}
          >
            Todas las ciudades
          </button>
          {CITY_FILTERS.map((city) => (
            <button
              key={city.value}
              type="button"
              onClick={() => setSelectedCity(city.value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selectedCity === city.value
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-red-600 bg-white text-red-600 hover:bg-red-50"
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        {/* Selector de tienda (si hay más de una en el filtro) */}
        {filteredStores.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filteredStores.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedStoreId(store.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  selectedStore?.id === store.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {store.name}
              </button>
            ))}
          </div>
        )}

        {selectedStore ? (
          <>
            {/* Imagen destacada — completa, sin recorte */}
            <div className="relative mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <div className="flex w-full items-center justify-center">
                <Image
                  src={HERO_IMAGE}
                  alt={`Punto de venta Icoltex — ${selectedStore.name}, ${cityLabel(selectedStore.city)}`}
                  width={1600}
                  height={1600}
                  className="h-auto w-full max-h-[320px] object-contain sm:max-h-[400px] md:max-h-[460px]"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>
              <span className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-red-600 shadow-md">
                {cityLabel(selectedStore.city)}
              </span>
            </div>

            {/* Detalle + mapa */}
            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {selectedStore.name} — {cityLabel(selectedStore.city)}
                </h2>

                <ul className="space-y-5">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Dirección:</p>
                      <p className="mt-0.5 text-sm text-slate-700">
                        {selectedStore.address}, {cityLabel(selectedStore.city)}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Celular:</p>
                      <a
                        href={`tel:${selectedStore.phone.replace(/\s/g, "")}`}
                        className="mt-0.5 block text-sm text-slate-700 hover:text-red-600"
                      >
                        {formatPhoneDisplay(selectedStore.phone)}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Días de atención:</p>
                      <p className="mt-0.5 text-sm text-slate-700">
                        Lunes a Sábado: 10:00 am – 7:00 pm
                      </p>
                      <p className="text-sm text-slate-700">Domingo: 10:00 am – 5:00 pm</p>
                    </div>
                  </li>
                </ul>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={phoneToWhatsAppUrl(selectedStore.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-red-700 sm:min-w-[12rem] sm:text-base"
                  >
                    Click aquí para que te atienda el punto de venta
                  </a>
                  <button
                    type="button"
                    disabled={routeLoading}
                    onClick={() => handleLoadRoute(selectedStore)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-6 py-3.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-70 sm:min-w-[12rem] sm:text-base"
                  >
                    <Navigation className="h-4 w-4 shrink-0" aria-hidden />
                    {routeLoading ? "Obteniendo ubicación…" : "Cargar ruta"}
                  </button>
                  {selectedStore.videoGuideUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoOpen(true)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-red-600 bg-white px-6 py-3.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:min-w-[12rem] sm:text-base"
                    >
                      Video guía
                    </button>
                  )}
                </div>
                {routeError && (
                  <p className="text-sm text-amber-700" role="status">
                    {routeError}
                  </p>
                )}

                <VideoGuideModal
                  open={videoOpen}
                  title={`Video guía · ${selectedStore.name} — ${cityLabel(selectedStore.city)}`}
                  videoUrl={
                    selectedStore.videoGuideUrl
                      ? toDrivePreviewUrl(selectedStore.videoGuideUrl)
                      : null
                  }
                  onClose={() => setVideoOpen(false)}
                />
              </div>

              <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm sm:h-[480px]">
                {mapStores.length > 0 && (
                  <StoresMap
                    key={selectedStore.id}
                    stores={mapStores}
                    selectedStoreId={selectedStore.id}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-slate-500">
            No hay puntos de venta para esta ciudad.
          </p>
        )}
      </div>
    </div>
  );
}
