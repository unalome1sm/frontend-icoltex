"use client";

import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export function ProductImageGallery({ images, alt }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImage = images[selectedIndex] ?? images[0];

  return (
    <div className="flex gap-3">
      {/* Miniaturas verticales a la izquierda */}
      <div className="flex shrink-0 flex-col gap-2">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`relative aspect-square w-16 overflow-hidden rounded border-2 transition sm:w-20 ${
              selectedIndex === i
                ? "border-red-600 ring-1 ring-red-600"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <img
              src={src}
              alt={`${alt} - vista ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      {/* Imagen principal */}
      <div className="relative aspect-square w-full min-h-[280px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:min-h-[360px] md:aspect-[4/5]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            Sin imagen
          </div>
        )}
      </div>
    </div>
  );
}
