"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type TwoImageSectionProps = {
  /** Ruta `/media/...`, URL o enlace Drive (imagen). Videos: .mov / .mp4 / .webm. */
  imageLeft?: string;
  imageRight?: string;
};

function resolveMediaSrc(url: string): string {
  const t = url.trim();
  if (isProbablyVideoUrl(t)) return t;
  const direct = toDirectImageUrl(t);
  if (!direct) return t;
  return getImageDisplayUrl(direct);
}

function isProbablyVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url);
}

function PanelVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => void v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    return () => v.removeEventListener("canplay", tryPlay);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      className="h-full w-full object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      controls={false}
      disablePictureInPicture
      aria-hidden
    />
  );
}

function PanelMedia({ src }: { src: string }) {
  if (isProbablyVideoUrl(src)) {
    return <PanelVideo src={src} />;
  }
  return <img src={src} alt="" className="h-full w-full object-cover" />;
}

export function TwoImageSection({ imageLeft, imageRight }: TwoImageSectionProps) {
  const leftSrc = imageLeft ? resolveMediaSrc(imageLeft) : null;
  const rightSrc = imageRight ? resolveMediaSrc(imageRight) : null;

  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black md:aspect-[2/1]">
        {leftSrc ? (
          <PanelMedia src={leftSrc} />
        ) : (
          <div className="h-full w-full bg-slate-800" aria-hidden />
        )}
        <Link
          href="/shop"
          className="absolute bottom-4 left-4 z-10 rounded-sm bg-red-800 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-900"
        >
          Comprar
        </Link>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black md:aspect-[2/1]">
        {rightSrc ? (
          <PanelMedia src={rightSrc} />
        ) : (
          <div
            className="h-full w-full bg-slate-900"
            style={{ filter: "hue-rotate(-30deg) saturate(1.2)" }}
            aria-hidden
          />
        )}
        <Link
          href="/shop"
          className="absolute bottom-4 left-4 z-10 rounded-sm bg-red-800 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-900"
        >
          Comprar
        </Link>
      </div>
    </section>
  );
}
