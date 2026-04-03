"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Store = {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  city: string;
};

const MOCK_STORES: Store[] = [
  { id: "1", name: "Alqueria", phone: "322 208-8441", address: "CL 42b Sur #52b-16", status: "Cerrado · Abre el lunes 10:00", city: "bogota" },
  { id: "2", name: "Alqueria", phone: "322 208-8442", address: "CL 42b Sur #520-16", status: "Abierto · Cierra 19:00", city: "bogota" },
  { id: "3", name: "Alqueria", phone: "322 208-8443", address: "CL 42b Sur #52S-16", status: "Cerrado · Abre el martes 09:00", city: "bogota" },
  { id: "4", name: "Alqueria", phone: "322 208-8444", address: "CL 42b Sur #525-16", status: "Cerrado · Abre el lunes 10:00", city: "bogota" },
  { id: "5", name: "Alqueria", phone: "322 208-8445", address: "CL 42b Sur #52B-16", status: "Abierto · Cierra 18:00", city: "bogota" },
  { id: "6", name: "Punto Medellín", phone: "310 111-2233", address: "Calle 50 #43-21", status: "Abierto · Cierra 20:00", city: "medellin" },
  { id: "7", name: "Punto Barranquilla", phone: "315 444-5566", address: "Carrera 52 #84-10", status: "Cerrado · Abre el lunes 08:00", city: "barranquilla" },
];

const CITIES = [
  { value: "", label: "Selecciona una ciudad" },
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "barranquilla", label: "Barranquilla" },
];

export function StoresPageContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("ciudad") ?? "";
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (cityParam && CITIES.some((c) => c.value === cityParam)) {
      setSelectedCity(cityParam);
    }
  }, [cityParam]);

  const filteredStores = useMemo(() => {
    if (!selectedCity) return MOCK_STORES;
    return MOCK_STORES.filter((s) => s.city === selectedCity);
  }, [selectedCity]);

  return (
    <div className="min-h-screen">
      {/* Pegado a la barra de promoción (como el banner del home: -mt-8) */}
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="relative flex min-h-[540px] w-full flex-col items-center justify-center overflow-hidden bg-red-600 px-6 text-center md:min-h-[720px] md:px-10">
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
                    className="border-b border-slate-100 bg-white p-4 last:border-b-0 hover:bg-slate-50/50"
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
          <div className="min-h-[400px] flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
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
