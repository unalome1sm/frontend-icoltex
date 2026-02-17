'use client';

import { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { getApiUrl, getAuthHeaders } from '@/lib/api';

type GalleryRow = {
  _id?: string;
  categoria: string;
  claseFamilia: string;
  imageUrls: string[];
};

function toDirectImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/drive\.google\.com\/uc\?export=view&id=/.test(trimmed)) return trimmed;
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  return trimmed;
}

function getImageDisplayUrl(directUrl: string): string {
  if (!directUrl) return '';
  if (directUrl.includes('drive.google.com') || directUrl.includes('lh3.googleusercontent.com')) {
    return getApiUrl(`/api/images/proxy?url=${encodeURIComponent(directUrl)}`);
  }
  return directUrl;
}

function Thumbnail({
  src,
  alt,
  onPreview,
}: {
  src: string;
  alt: string;
  onPreview: (displaySrc: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const displaySrc = getImageDisplayUrl(toDirectImageUrl(src));

  if (error) return null;
  return (
    <button
      type="button"
      className="h-12 w-12 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100"
      onClick={() => onPreview(displaySrc)}
      aria-label={alt}
    >
      {!loaded && <div className="h-full w-full animate-pulse bg-slate-200" />}
      <img
        src={displaySrc}
        alt=""
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </button>
  );
}

function GalleryImage({
  src,
  alt,
  onPreview,
  onRemove,
  removing,
}: {
  src: string;
  alt: string;
  onPreview?: (displaySrc: string) => void;
  onRemove?: () => void;
  removing?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const directSrc = toDirectImageUrl(src);
  const displaySrc = getImageDisplayUrl(directSrc);

  if (error) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500">
        Error
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${onPreview && loaded ? 'cursor-zoom-in' : ''}`}
        onClick={() => onPreview && loaded && onPreview(displaySrc)}
        onKeyDown={(e) => onPreview && loaded && e.key === 'Enter' && onPreview(displaySrc)}
        role={onPreview && loaded ? 'button' : undefined}
        tabIndex={onPreview && loaded ? 0 : undefined}
      >
        {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
        <img
          src={displaySrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          draggable={false}
        />
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="w-full rounded border border-slate-200 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Quitar
        </button>
      )}
    </div>
  );
}

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<GalleryRow[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [categoriesByFamily, setCategoriesByFamily] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [expandedGallery, setExpandedGallery] = useState<GalleryRow | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [savingImages, setSavingImages] = useState(false);
  const [error, setError] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [newClase, setNewClase] = useState('');
  const [newCategoria, setNewCategoria] = useState('');

  function rowKey(g: GalleryRow) {
    return `${g.claseFamilia}|${g.categoria}`;
  }

  function fetchGalleries() {
    setLoadingList(true);
    fetch(getApiUrl('/api/product-galleries/list'), { credentials: 'include', headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setGalleries(Array.isArray(data) ? data : []);
      })
      .catch(() => setGalleries([]))
      .finally(() => setLoadingList(false));
  }

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    fetch(getApiUrl('/api/products/meta/classes'), { credentials: 'include', headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((cls) => setClasses(Array.isArray(cls) ? cls.filter(Boolean).sort() : []))
      .catch(() => {})
      .finally(() => setLoadingMeta(false));
  }, []);

  useEffect(() => {
    if (!newClase.trim()) {
      setCategoriesByFamily([]);
      setNewCategoria('');
      return;
    }
    setLoadingCategories(true);
    const params = new URLSearchParams({ claseFamilia: newClase.trim() });
    fetch(getApiUrl(`/api/products/meta/categories?${params}`), { credentials: 'include', headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((cats) => setCategoriesByFamily(Array.isArray(cats) ? cats.filter(Boolean).sort() : []))
      .catch(() => setCategoriesByFamily([]))
      .finally(() => setLoadingCategories(false));
    setNewCategoria('');
  }, [newClase]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [lightboxSrc]);

  async function addImage() {
    if (!expandedGallery) return;
    const url = newImageUrl.trim();
    if (!url) return;
    const urls = [...(expandedGallery.imageUrls || []), url];
    setSavingImages(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/product-galleries'), {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          claseFamilia: expandedGallery.claseFamilia,
          categoria: expandedGallery.categoria,
          imageUrls: urls,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExpandedGallery({ ...expandedGallery, imageUrls: data.imageUrls || urls });
      setGalleries((prev) =>
        prev.map((g) =>
          rowKey(g) === rowKey(expandedGallery) ? { ...g, imageUrls: data.imageUrls || urls } : g
        )
      );
      setNewImageUrl('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSavingImages(false);
    }
  }

  async function removeImage(index: number) {
    if (!expandedGallery?.imageUrls) return;
    const urls = expandedGallery.imageUrls.filter((_, i) => i !== index);
    setSavingImages(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/product-galleries'), {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          claseFamilia: expandedGallery.claseFamilia,
          categoria: expandedGallery.categoria,
          imageUrls: urls,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExpandedGallery({ ...expandedGallery, imageUrls: data.imageUrls || urls });
      setGalleries((prev) =>
        prev.map((g) =>
          rowKey(g) === rowKey(expandedGallery) ? { ...g, imageUrls: data.imageUrls || urls } : g
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSavingImages(false);
    }
  }

  async function createAndManage() {
    if (!newClase.trim() || !newCategoria.trim()) return;
    setSavingImages(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/api/product-galleries'), {
        method: 'PUT',
        credentials: 'include',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          claseFamilia: newClase.trim(),
          categoria: newCategoria.trim(),
          imageUrls: [],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      fetchGalleries();
      setExpandedKey(`${newClase.trim()}|${newCategoria.trim()}`);
      setExpandedGallery(data);
      setNewClase('');
      setNewCategoria('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear');
    } finally {
      setSavingImages(false);
    }
  }

  function openManage(g: GalleryRow) {
    const key = rowKey(g);
    if (expandedKey === key) {
      setExpandedKey(null);
      setExpandedGallery(null);
    } else {
      setExpandedKey(key);
      setExpandedGallery(g);
      setNewImageUrl('');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Galerías por línea</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tabla de líneas (categoría + clase) con las imágenes subidas. Gestiona o crea galerías desde aquí.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Panel
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Nueva galería */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Nueva galería
        </h2>
        {loadingMeta ? (
          <p className="text-sm text-slate-500">Cargando opciones…</p>
        ) : (
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Clase / Familia</label>
              <select
                value={newClase}
                onChange={(e) => setNewClase(e.target.value)}
                className="min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="">Seleccionar…</option>
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Categoría</label>
              <select
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
                disabled={!newClase.trim() || loadingCategories}
                className="min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-60"
              >
                <option value="">
                  {!newClase.trim()
                    ? 'Primero elige clase/familia'
                    : loadingCategories
                      ? 'Cargando…'
                      : categoriesByFamily.length === 0
                        ? 'Sin categorías para esta familia'
                        : 'Seleccionar…'}
                </option>
                {categoriesByFamily.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={createAndManage}
              disabled={savingImages || !newClase.trim() || !newCategoria.trim() || loadingCategories}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Crear y gestionar
            </button>
          </div>
        )}
      </div>

      {/* Tabla de galerías */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Líneas con galería</h2>
          <p className="text-sm text-slate-500">Detalle de imágenes subidas por cada categoría y clase.</p>
        </div>
        <div className="overflow-x-auto">
          {loadingList ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">Cargando…</div>
          ) : galleries.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              No hay galerías aún. Crea una arriba con «Crear y gestionar».
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Clase / Familia</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Categoría</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-700">Imágenes</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-700">Detalle de imágenes</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {galleries.map((g) => {
                  const key = rowKey(g);
                  const urls = g.imageUrls || [];
                  const isExpanded = expandedKey === key;
                  return (
                    <Fragment key={key}>
                      <tr
                        className={`border-b border-slate-100 ${isExpanded ? 'bg-slate-50' : ''} hover:bg-slate-50/50`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{g.claseFamilia}</td>
                        <td className="px-4 py-3 text-slate-700">{g.categoria}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{urls.length}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {urls.slice(0, 6).map((url, i) => (
                              <Thumbnail
                                key={`${url}-${i}`}
                                src={url}
                                alt={`${g.categoria} ${i + 1}`}
                                onPreview={setLightboxSrc}
                              />
                            ))}
                            {urls.length > 6 && (
                              <span className="flex h-12 items-center text-xs text-slate-500">
                                +{urls.length - 6}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => openManage(g)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            {isExpanded ? 'Cerrar' : 'Gestionar'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && expandedGallery && rowKey(expandedGallery) === key && (
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                          <td colSpan={5} className="px-6 py-4">
                            <div className="space-y-4">
                              <p className="text-xs font-medium text-slate-600">
                                Agregar imagen (URL de Google Drive u otra)
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  value={newImageUrl}
                                  onChange={(e) => setNewImageUrl(e.target.value)}
                                  placeholder="https://drive.google.com/file/d/.../view"
                                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                                />
                                <button
                                  type="button"
                                  onClick={addImage}
                                  disabled={savingImages || !newImageUrl.trim()}
                                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                  {savingImages ? 'Guardando…' : 'Agregar'}
                                </button>
                              </div>
                              {expandedGallery.imageUrls.length === 0 ? (
                                <p className="text-sm text-slate-500">Aún no hay imágenes.</p>
                              ) : (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                  {expandedGallery.imageUrls.map((url, index) => (
                                    <GalleryImage
                                      key={`${url}-${index}`}
                                      src={url}
                                      alt={`Imagen ${index + 1}`}
                                      onPreview={setLightboxSrc}
                                      onRemove={() => removeImage(index)}
                                      removing={savingImages}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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

      <p>
        <Link href="/admin" className="text-sm text-slate-600 hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </div>
  );
}
