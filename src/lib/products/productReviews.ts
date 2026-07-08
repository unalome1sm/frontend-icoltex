import { apiFetch } from "../api";

export type ProductReview = {
  id: string;
  userId: string;
  groupId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductReviewsSummary = {
  count: number;
  averageRating: number | null;
};

export type ProductReviewsResponse = {
  reviews: ProductReview[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: ProductReviewsSummary;
  myReview: ProductReview | null;
  error?: string;
};

export type SubmitReviewResponse = ProductReviewsResponse & {
  review: ProductReview;
};

export async function fetchProductReviews(
  groupId: string,
  page = 1,
  limit = 10,
): Promise<ProductReviewsResponse> {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("limit", String(limit));
  return apiFetch<ProductReviewsResponse>(
    `/api/catalog/grouped-products/${encodeURIComponent(groupId)}/reviews?${sp}`,
  );
}

export async function submitProductReview(
  groupId: string,
  input: { rating: number; comment: string },
): Promise<SubmitReviewResponse> {
  return apiFetch<SubmitReviewResponse>(
    `/api/catalog/grouped-products/${encodeURIComponent(groupId)}/reviews`,
    { method: "POST", body: input },
  );
}
