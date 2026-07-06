"use client";

import { StarRatingInput } from "./ReviewStars";

type Props = {
  rating: number;
  comment: string;
  onRatingChange: (v: number) => void;
  onCommentChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitError: string;
  submitSuccess: string;
  isUpdate: boolean;
  compact?: boolean;
};

export function ReviewWriteForm({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  submitting,
  submitError,
  submitSuccess,
  isUpdate,
  compact = false,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-3 rounded-lg border border-slate-200 bg-white ${compact ? "p-3" : "p-4"}`}
    >
      <p className="text-sm font-medium text-slate-800">
        {isUpdate ? "Actualiza tu evaluación" : "Deja tu evaluación"}
      </p>
      <StarRatingInput value={rating} onChange={onRatingChange} disabled={submitting} />
      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Cuéntanos qué te pareció el producto…"
        rows={4}
        maxLength={2000}
        disabled={submitting}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
      />
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      {submitSuccess && <p className="text-sm text-green-700">{submitSuccess}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {submitting ? "Publicando…" : isUpdate ? "Actualizar evaluación" : "Publicar evaluación"}
      </button>
    </form>
  );
}
