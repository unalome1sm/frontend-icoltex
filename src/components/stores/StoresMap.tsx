"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  CITY_CENTERS,
  COLOMBIA_CENTER,
  type Store,
  cityLabel,
  getStoreFullAddress,
} from "@/data/stores";

export type StorePosition = { lat: number; lng: number };

type StoresMapProps = {
  stores: Store[];
  selectedStoreId: string | null;
};

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

function MapViewport({
  stores,
  positions,
  selectedStoreId,
}: {
  stores: Store[];
  positions: Record<string, StorePosition>;
  selectedStoreId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const coords = stores
      .map((s) => positions[s.id])
      .filter((p): p is StorePosition => Boolean(p));

    if (coords.length === 0) {
      const city = stores[0]?.city;
      const center = (city && CITY_CENTERS[city]) || COLOMBIA_CENTER;
      map.setCenter({ lat: center.lat, lng: center.lng });
      map.setZoom(center.zoom);
      return;
    }

    if (selectedStoreId && positions[selectedStoreId]) {
      const p = positions[selectedStoreId];
      map.panTo(p);
      map.setZoom(16);
      return;
    }

    if (coords.length === 1) {
      map.setCenter(coords[0]);
      map.setZoom(15);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    coords.forEach((c) => bounds.extend(c));
    map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
  }, [map, stores, positions, selectedStoreId]);

  return null;
}

function GeocodeStores({
  stores,
  onPositions,
}: {
  stores: Store[];
  onPositions: React.Dispatch<
    React.SetStateAction<Record<string, StorePosition>>
  >;
}) {
  const geocoding = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocoding) return;

    const geocoder = new geocoding.Geocoder();
    let cancelled = false;

    const withCoords = stores.filter(
      (s) => typeof s.lat === "number" && typeof s.lng === "number",
    );
    if (withCoords.length > 0) {
      onPositions((prev) => {
        const next = { ...prev };
        withCoords.forEach((s) => {
          next[s.id] = { lat: s.lat!, lng: s.lng! };
        });
        return next;
      });
    }

    const toGeocode = stores.filter(
      (s) => typeof s.lat !== "number" || typeof s.lng !== "number",
    );
    if (toGeocode.length === 0) return;

    (async () => {
      for (const store of toGeocode) {
        if (cancelled) return;
        const address = getStoreFullAddress(store);
        await new Promise<void>((resolve) => {
          geocoder.geocode({ address }, (results, status) => {
            if (cancelled) {
              resolve();
              return;
            }
            if (status === "OK" && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              const position = { lat: loc.lat(), lng: loc.lng() };
              onPositions((prev) => ({ ...prev, [store.id]: position }));
            }
            resolve();
          });
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [geocoding, stores, onPositions]);

  return null;
}

function StoresMapInner({ stores, selectedStoreId }: StoresMapProps) {
  const [positions, setPositions] = useState<Record<string, StorePosition>>(
    {},
  );

  const defaultView = useMemo(() => {
    if (stores.length === 0) return COLOMBIA_CENTER;
    const city = stores[0].city;
    return CITY_CENTERS[city] ?? COLOMBIA_CENTER;
  }, [stores]);

  const markers = stores.filter((s) => positions[s.id]);

  return (
    <Map
      defaultCenter={{ lat: defaultView.lat, lng: defaultView.lng }}
      defaultZoom={defaultView.zoom}
      gestureHandling="greedy"
      className="h-full w-full min-h-[400px]"
      fullscreenControl={false}
      mapTypeControl={false}
      streetViewControl={false}
    >
      <GeocodeStores stores={stores} onPositions={setPositions} />
      <MapViewport
        stores={stores}
        positions={positions}
        selectedStoreId={selectedStoreId}
      />
      {markers.map((store) => {
        const pos = positions[store.id];
        return (
          <Marker
            key={store.id}
            position={pos}
            title={`${store.name} - ${cityLabel(store.city)}`}
          />
        );
      })}
    </Map>
  );
}

export function StoresMap({ stores, selectedStoreId }: StoresMapProps) {
  if (!API_KEY) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center bg-slate-100 p-6 text-center text-sm text-slate-600">
        <p>
          Falta configurar{" "}
          <code className="rounded bg-slate-200 px-1">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          en el archivo <code className="rounded bg-slate-200 px-1">.env</code>.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <StoresMapInner stores={stores} selectedStoreId={selectedStoreId} />
    </APIProvider>
  );
}
