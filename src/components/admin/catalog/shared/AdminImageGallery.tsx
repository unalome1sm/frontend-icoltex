"use client";

import { useEffect, useState } from "react";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

function GalleryImage({
  src,
  alt,
  onPreview,
}: {
  src: string;
  alt: string;
  onPreview?: (displaySrc: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const displaySrc = getImageDisplayUrl(toDirectImageUrl(src));

  if (error || !displaySrc) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500">
        Error al cargar
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${onPreview && loaded ? "cursor-zoom-in" : ""}`}
      onClick={() => onPreview && loaded && onPreview(displaySrc)}
      onKeyDown={(e) => onPreview && loaded && e.key === "Enter" && onPreview(displaySrc)}
      role={onPreview && loaded ? "button" : undefined}
      tabIndex={onPreview && loaded ? 0 : undefined}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden />}
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        draggable={false}
      />
    </div>
  );
}

type Props = {
  urls: string[];
  title?: string;
  emptyMessage?: string;
};

export function AdminImageGallery({
  urls,
  title = "Imágenes",
  emptyMessage = "No hay imágenes disponibles.",
}: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [lightboxSrc]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      {urls.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {urls.map((url, index) => (
            <GalleryImage
              key={`${url}-${index}`}
              src={url}
              alt={`${title} ${index + 1}`}
              onPreview={setLightboxSrc}
            />
          ))}
        </div>
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
          >
            Cerrar
          </button>
          <img
            src={lightboxSrc}
            alt="Vista ampliada"
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
