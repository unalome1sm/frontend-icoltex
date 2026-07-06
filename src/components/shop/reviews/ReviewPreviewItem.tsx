"use client";

import type { ProductReview } from "@/lib/productReviews";
import { StarRatingDisplay } from "./ReviewStars";
import { deriveReviewTitle } from "./reviewUtils";

type Props = {
  review: ProductReview;
};

export function ReviewPreviewItem({ review }: Props) {
  const title = deriveReviewTitle(review.comment);

  return (
    <article className="border-b border-slate-100 py-4 last:border-0">
      <p className="font-semibold text-slate-900">{title}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <StarRatingDisplay value={review.rating} size="sm" variant="dark" />
        <span className="text-sm text-slate-500">{review.authorName} -</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{review.comment}</p>
    </article>
  );
}
