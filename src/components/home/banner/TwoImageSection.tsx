"use client";

import Link from "next/link";
import { BannerVideo } from "./BannerVideo";
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

function PanelMedia({ src }: { src: string }) {
  if (isProbablyVideoUrl(src)) {
    return <BannerVideo src={src} />;
  }
  return <img src={src} alt="" className="h-full w-full object-cover" />;
}

const panelCtaClassName =
  "absolute bottom-4 left-1/2 z-10 inline-flex h-12 -translate-x-1/2 items-center justify-center rounded bg-red-800 px-6 text-button text-white transition hover:bg-red-900 md:left-4 md:translate-x-0";

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
        <Link href="/shop" className={panelCtaClassName}>
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
        <Link href="/shop" className={panelCtaClassName}>
          Comprar
        </Link>
      </div>
    </section>
  );
}
