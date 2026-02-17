'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getApiUrl, getAuthHeaders } from '@/lib/api';

/** Convierte URL de compartir de Google Drive a URL directa de imagen */
export function toDirectImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/drive\.google\.com\/uc\?export=view&id=/.test(trimmed)) return trimmed;
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
  return trimmed;
}

/** Para imágenes de Google Drive usamos el proxy del backend para evitar 403 por CORS/origen */
function getImageDisplayUrl(directUrl: string): string {
  if (!directUrl) return '';
  if (directUrl.includes('drive.google.com') || directUrl.includes('lh3.googleusercontent.com')) {
    return getApiUrl(`/api/images/proxy?url=${encodeURIComponent(directUrl)}`);
  }
  return directUrl;
}

type Product = {
  _id: string;
  codigo: string;
  nombre: string;
  claseFamilia?: string;
  categoria?: string;
  stock: number;
  colores?: string;
  unidadMedida?: string;
  caracteristica?: string;
  recomendacionesCuidados?: string;
  recomendacionesUsos?: string;
  precioMetro?: number;
  precioKilos?: number;
  activo: boolean;
  imageUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
};

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (value == null || value === '') return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className={`mt-1 text-sm text-slate-900 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}

/** Imagen con placeholder; clic abre en lightbox si se pasa onPreview */
function ProductImage({
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
  const directSrc = toDirectImageUrl(src);
  const displaySrc = getImageDisplayUrl(directSrc);

  if (error) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500">
        Error al cargar
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${onPreview && loaded ? 'cursor-zoom-in' : ''}`}
      onClick={() => onPreview && loaded && onPreview(displaySrc)}
      onKeyDown={(e) => onPreview && loaded && e.key === 'Enter' && onPreview(displaySrc)}
      role={onPreview && loaded ? 'button' : undefined}
      tabIndex={onPreview && loaded ? 0 : undefined}
      aria-label={onPreview && loaded ? 'Ver imagen ampliada' : undefined}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" aria-hidden />
      )}
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-center transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        draggable={false}
      />
    </div>
  );
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const fetchProduct = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    fetch(getApiUrl(`/api/products/${id}`), { credentials: 'include', headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProduct(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (!product?.categoria?.trim() || !product?.claseFamilia?.trim()) {
      setGalleryImageUrls([]);
      return;
    }
    setGalleryLoading(true);
    const params = new URLSearchParams({
      categoria: product.categoria.trim(),
      claseFamilia: product.claseFamilia.trim(),
    });
    fetch(getApiUrl(`/api/product-galleries?${params}`), {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setGalleryImageUrls(Array.isArray(data.imageUrls) ? data.imageUrls : []);
      })
      .catch(() => setGalleryImageUrls([]))
      .finally(() => setGalleryLoading(false));
  }, [product?.categoria, product?.claseFamilia]);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [lightboxSrc]);

  if (loading && !product) {
    return (
      <div className="space-y-6">
        <p className="text-slate-500">Cargando producto...</p>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="text-slate-500">Producto no encontrado.</p>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>
    );
  }

  const hasGalleryKeys = Boolean(product.categoria?.trim() && product.claseFamilia?.trim());
  const images = galleryImageUrls;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{product.nombre}</h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{product.codigo}</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Volver a productos
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Datos del producto */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Datos del producto
          </h2>
          <dl className="space-y-4">
            <DetailRow label="Código" value={product.codigo} mono />
            <DetailRow label="Nombre" value={product.nombre} />
            <DetailRow label="Clase / Familia" value={product.claseFamilia} />
            <DetailRow label="Categoría" value={product.categoria} />
            <DetailRow label="Colores" value={product.colores} />
            <DetailRow label="Unidad de medida" value={product.unidadMedida} />
            <DetailRow label="Stock" value={product.stock != null ? String(product.stock) : undefined} />
            <DetailRow
              label="Precio por metro"
              value={product.precioMetro != null ? `$${product.precioMetro.toLocaleString('es-CO')}` : undefined}
            />
            <DetailRow
              label="Precio por kilos"
              value={product.precioKilos != null ? `$${product.precioKilos.toLocaleString('es-CO')}` : undefined}
            />
            <DetailRow label="Característica" value={product.caracteristica} />
            <DetailRow label="Recomendaciones de cuidados" value={product.recomendacionesCuidados} />
            <DetailRow label="Recomendaciones de usos" value={product.recomendacionesUsos} />
            <DetailRow label="Estado" value={product.activo ? 'Activo' : 'Inactivo'} />
            {product.createdAt && (
              <DetailRow
                label="Fecha de creación"
                value={new Date(product.createdAt).toLocaleString('es-CO')}
              />
            )}
            {product.updatedAt && (
              <DetailRow
                label="Última actualización"
                value={new Date(product.updatedAt).toLocaleString('es-CO')}
              />
            )}
          </dl>
        </div>

        {/* Imágenes de la línea (solo lectura); se gestionan en Galerías por línea */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Imágenes de la línea
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            Fotos de la línea <strong>{product.categoria || '—'}</strong> / <strong>{product.claseFamilia || '—'}</strong>. Para agregar o quitar imágenes, ve a <Link href="/admin/galleries" className="font-medium text-slate-700 underline hover:no-underline">Galerías por línea</Link> en el menú.
          </p>

          {!hasGalleryKeys ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50/50 py-4 text-center text-sm text-slate-500">
              Este producto no tiene categoría o clase/familia.
            </p>
          ) : galleryLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">Cargando galería…</p>
          ) : images.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-500">
              No hay imágenes para esta línea. Agrégalas en Galerías por línea.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map((url, index) => (
                <ProductImage
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${product.nombre} ${index + 1}`}
                  onPreview={setLightboxSrc}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox: imagen ampliada al hacer clic */}
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
    </div>
  );
}
