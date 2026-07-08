"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getBannerVideoSources, HOME_BANNER_IMAGE_SLIDES } from "@/config/homeMedia";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

type BannerSlide =
  | { kind: "video"; id: string; src: string }
  | { kind: "image"; id: string; src: string; alt: string }
  | { kind: "color"; id: string; bgColor: string };

const ROTATE_INTERVAL_MS = 8000;

function buildSlides(videoSrcs: string[]): BannerSlide[] {
  const list: BannerSlide[] = [];

  for (let i = 0; i < videoSrcs.length; i++) {
    const src = videoSrcs[i];
    list.push({ kind: "video", id: `video:${src}`, src });
  }

  for (let i = 0; i < HOME_BANNER_IMAGE_SLIDES.length; i++) {
    const s = HOME_BANNER_IMAGE_SLIDES[i];
    const direct = toDirectImageUrl(s.driveOrImageUrl);
    if (!direct) continue;
    const src = getImageDisplayUrl(direct);
    list.push({ kind: "image", id: `img-${i}`, src, alt: s.alt });
  }

  if (list.length === 0) {
    list.push({ kind: "color", id: "fallback-1", bgColor: "bg-slate-100" });
    list.push({ kind: "color", id: "fallback-2", bgColor: "bg-slate-200" });
    list.push({ kind: "color", id: "fallback-3", bgColor: "bg-slate-100" });
  }

  return list;
}

type HeroVideoProps = {
  src: string;
  onBroken: () => void;
};

function BannerHeroVideo({ src, onBroken }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      el.defaultMuted = true;
      void el.play().catch(() => {});
    };

    tryPlay();
    el.addEventListener("canplay", tryPlay, { once: true });

    return () => {
      el.removeEventListener("canplay", tryPlay);
    };
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
      preload="auto"
      controls={false}
      disablePictureInPicture
      onError={onBroken}
      aria-hidden
    />
  );
}

export function BannerCarousel() {
  const configuredSources = useMemo(() => getBannerVideoSources(), []);
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set());

  const videoSrcs = useMemo(
    () => configuredSources.filter((s) => !brokenSrcs.has(s)),
    [configuredSources, brokenSrcs],
  );

  const markBroken = useCallback((src: string) => {
    setBrokenSrcs((prev) => {
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  const slides = useMemo(() => buildSlides(videoSrcs), [videoSrcs]);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const current = slides[index];
  const showControls = slides.length > 1;

  useEffect(() => {
    setIndex((i) => {
      if (slides.length === 0) return 0;
      return i >= slides.length ? 0 : i;
    });
  }, [slides.length]);

  const goTo = useCallback((nextIndex: number, dir: "next" | "prev") => {
    setDirection(dir);
    setIndex(nextIndex);
  }, []);

  const next = useCallback(() => {
    goTo((index + 1) % slides.length, "next");
  }, [index, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((index - 1 + slides.length) % slides.length, "prev");
  }, [index, goTo, slides.length]);

  useEffect(() => {
    if (!showControls) return;
    const id = setInterval(next, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [next, showControls]);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {showControls && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md transition hover:bg-white hover:shadow-lg md:left-4"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md transition hover:bg-white hover:shadow-lg md:right-4"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        key={current.id}
        className="relative z-[2] flex w-full min-h-[540px] items-end justify-start px-6 pb-8 md:min-h-[720px] md:px-10 md:pb-10"
        style={{
          animation: showControls
            ? direction === "next"
              ? "banner-slide-in-right 0.5s ease-out forwards"
              : "banner-slide-in-left 0.5s ease-out forwards"
            : undefined,
        }}
      >
        {current.kind === "video" && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <BannerHeroVideo src={current.src} onBroken={() => markBroken(current.src)} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" aria-hidden />
          </div>
        )}

        {current.kind === "image" && (
          <div className="absolute inset-0 z-0 bg-black">
            <div className="relative h-full w-full">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                unoptimized={
                  current.src.includes("/api/images/proxy") || current.src.startsWith("data:")
                }
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden />
          </div>
        )}

        {current.kind === "color" && (
          <div className={`absolute inset-0 ${current.bgColor}`} aria-hidden />
        )}

        <Link
          href="/shop"
          className="relative z-10 inline-block rounded-sm bg-red-800 px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-900"
        >
          Comprar
        </Link>
      </div>
    </section>
  );
}
