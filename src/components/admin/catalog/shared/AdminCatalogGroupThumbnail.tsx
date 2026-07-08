"use client";

import { useState } from "react";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type Props = {
  url?: string;
  alt: string;
};

export function AdminCatalogGroupThumbnail({ url, alt }: Props) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100 text-[10px] text-slate-400">
        Sin img
      </div>
    );
  }

  const src = getImageDisplayUrl(toDirectImageUrl(url));

  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 shrink-0 rounded border border-slate-200 object-cover"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
