"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, Pencil } from "lucide-react";
import {
  fetchProductReviews,
  type ProductReview,
  type ProductReviewsSummary,
} from "@/lib/productReviews";
import { StarRatingDisplay } from "./ReviewStars";
import { ReviewPreviewItem } from "./ReviewPreviewItem";
import { ReviewWriteForm } from "./ReviewWriteForm";
import { formatProductPrice } from "./reviewUtils";

type Props = {
  open: boolean;
  onClose: () => void;
  groupId: string;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
  summary: ProductReviewsSummary;
  writeFormOpen: boolean;
  onWriteClick: () => void;
  rating: number;
  comment: string;
  onRatingChange: (v: number) => void;
  onCommentChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitError: string;
  submitSuccess: string;
  isUpdate: boolean;
  refreshKey: number;
};

const PAGE_SIZE = 10;

export function AllReviewsModal({
  open,
  onClose,
  groupId,
  productName,
  productImageUrl,
  productPrice,
  summary,
  writeFormOpen,
  onWriteClick,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  submitting,
  submitError,
  submitSuccess,
  isUpdate,
  refreshKey,
}: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPage = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProductReviews(groupId, pageNum, PAGE_SIZE);
        setReviews(data.reviews);
        setPage(data.pagination.page);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar reseñas");
      } finally {
        setLoading(false);
      }
    },
    [groupId],
  );

  useEffect(() => {
    if (!open) return;
    void loadPage(1);
  }, [open, loadPage, refreshKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const averageLabel =
    summary.averageRating != null
      ? summary.averageRating.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : "0";

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-reviews-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="all-reviews-title" className="text-lg font-semibold text-slate-900">
            Todas las reseñas
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="flex gap-4 border-b border-slate-100 pb-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {productImageUrl ? (
                <Image
                  src={productImageUrl}
                  alt={productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900">{productName}</p>
              <p className="mt-1 text-sm text-slate-600">{formatProductPrice(productPrice)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 py-4">
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {averageLabel} de 5 estrellas
              </p>
              {summary.averageRating != null && (
                <StarRatingDisplay value={summary.averageRating} size="lg" variant="dark" />
              )}
            </div>
            <button
              type="button"
              onClick={onWriteClick}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Pencil className="h-4 w-4" />
              Escriba una reseña
            </button>
          </div>

          {writeFormOpen && (
            <div className="border-b border-slate-100 py-4">
              <ReviewWriteForm
                rating={rating}
                comment={comment}
                onRatingChange={onRatingChange}
                onCommentChange={onCommentChange}
                onSubmit={onSubmit}
                submitting={submitting}
                submitError={submitError}
                submitSuccess={submitSuccess}
                isUpdate={isUpdate}
                compact
              />
            </div>
          )}

          <p className="py-4 text-sm text-slate-600">
            {total > 0
              ? `${rangeStart} a ${rangeEnd} de ${total} reseñas`
              : "0 reseñas"}
          </p>

          {loading ? (
            <p className="pb-6 text-sm text-slate-500">Cargando reseñas…</p>
          ) : error ? (
            <p className="pb-6 text-sm text-red-600">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="pb-6 text-sm text-slate-600">Aún no hay reseñas para este producto.</p>
          ) : (
            <div>
              {reviews.map((r) => (
                <ReviewPreviewItem key={r.id} review={r} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-slate-100 py-4">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => loadPage(page - 1)}
                className="rounded border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-slate-500">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => loadPage(page + 1)}
                className="rounded border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
