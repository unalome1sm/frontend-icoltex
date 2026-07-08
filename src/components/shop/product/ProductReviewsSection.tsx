"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductAccordion } from "./ProductAccordion";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchProductReviews,
  submitProductReview,
  type ProductReview,
  type ProductReviewsSummary,
} from "@/lib/products";
import { StarRatingDisplay } from "../reviews/ReviewStars";
import { ReviewPreviewItem } from "../reviews/ReviewPreviewItem";
import { ReviewWriteForm } from "../reviews/forms/ReviewWriteForm";
import { ReviewLoginPromptModal } from "../reviews/modals/ReviewLoginPromptModal";
import { AllReviewsModal } from "../reviews/modals/AllReviewsModal";

const PREVIEW_LIMIT = 3;

type Props = {
  groupId: string;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
};

export function ProductReviewsSection({
  groupId,
  productName,
  productImageUrl,
  productPrice,
}: Props) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [summary, setSummary] = useState<ProductReviewsSummary>({ count: 0, averageRating: null });
  const [previewReviews, setPreviewReviews] = useState<ProductReview[]>([]);
  const [myReview, setMyReview] = useState<ProductReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);
  const [writeFormOpen, setWriteFormOpen] = useState(false);
  const [writeFormInModal, setWriteFormInModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const applyMyReview = useCallback((review: ProductReview | null) => {
    setMyReview(review);
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, []);

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProductReviews(groupId, 1, PREVIEW_LIMIT);
      setPreviewReviews(data.reviews);
      setSummary(data.summary);
      applyMyReview(data.myReview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar evaluaciones");
    } finally {
      setLoading(false);
    }
  }, [groupId, applyMyReview]);

  useEffect(() => {
    if (!authLoading) {
      void loadPreview();
    }
  }, [loadPreview, authLoading, isAuthenticated]);

  function requestWriteReview(target: "accordion" | "modal") {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoginPromptOpen(true);
      return;
    }
    setSubmitError("");
    setSubmitSuccess("");
    if (target === "accordion") {
      setWriteFormOpen(true);
    } else {
      setWriteFormInModal(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    if (rating < 1 || rating > 5) {
      setSubmitError("Selecciona una calificación de 1 a 5 estrellas.");
      return;
    }
    if (!comment.trim()) {
      setSubmitError("Escribe un comentario.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await submitProductReview(groupId, { rating, comment: comment.trim() });
      setSummary(data.summary);
      setPreviewReviews(data.reviews.slice(0, PREVIEW_LIMIT));
      applyMyReview(data.review);
      setRefreshKey((k) => k + 1);
      setSubmitSuccess(myReview ? "Evaluación actualizada." : "¡Gracias por tu evaluación!");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No se pudo publicar");
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    summary.count > 0 ? `Reseñas (${summary.count})` : "Reseñas";

  const headerExtra =
    summary.count > 0 && summary.averageRating != null ? (
      <StarRatingDisplay value={summary.averageRating} variant="dark" />
    ) : null;

  const showMoreLink = summary.count > PREVIEW_LIMIT;

  return (
    <>
      <ProductAccordion title={title} headerExtra={headerExtra}>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => requestWriteReview("accordion")}
            className="text-sm font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700"
          >
            Escribe una evaluación
          </button>

          {writeFormOpen && isAuthenticated && (
            <div className="pt-3">
              <ReviewWriteForm
                rating={rating}
                comment={comment}
                onRatingChange={setRating}
                onCommentChange={setComment}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
                submitSuccess={submitSuccess}
                isUpdate={Boolean(myReview)}
              />
            </div>
          )}

          {loading ? (
            <p className="pt-3 text-sm text-slate-500">Cargando evaluaciones…</p>
          ) : error ? (
            <p className="pt-3 text-sm text-red-600">{error}</p>
          ) : previewReviews.length === 0 ? (
            <p className="pt-3 text-sm text-slate-600">
              Aún no hay evaluaciones. Sé el primero en opinar.
            </p>
          ) : (
            <div className="pt-2">
              {previewReviews.map((r) => (
                <ReviewPreviewItem key={r.id} review={r} />
              ))}
            </div>
          )}

          {showMoreLink && (
            <button
              type="button"
              onClick={() => setAllReviewsOpen(true)}
              className="pt-2 text-sm font-semibold text-slate-900 underline underline-offset-2 hover:text-slate-700"
            >
              Más reseñas
            </button>
          )}
        </div>
      </ProductAccordion>

      <ReviewLoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
      />

      <AllReviewsModal
        open={allReviewsOpen}
        onClose={() => {
          setAllReviewsOpen(false);
          setWriteFormInModal(false);
        }}
        groupId={groupId}
        productName={productName}
        productImageUrl={productImageUrl}
        productPrice={productPrice}
        summary={summary}
        writeFormOpen={writeFormInModal && isAuthenticated}
        onWriteClick={() => requestWriteReview("modal")}
        rating={rating}
        comment={comment}
        onRatingChange={setRating}
        onCommentChange={setComment}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
        isUpdate={Boolean(myReview)}
        refreshKey={refreshKey}
      />
    </>
  );
}
