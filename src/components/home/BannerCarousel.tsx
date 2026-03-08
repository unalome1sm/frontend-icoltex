"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const BANNER_SLIDES = [
  { id: 1, bgColor: "bg-slate-100" },
  { id: 2, bgColor: "bg-slate-200" },
  { id: 3, bgColor: "bg-slate-100" },
];

const ROTATE_INTERVAL_MS = 6000;

export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const current = BANNER_SLIDES[index];

  const goTo = useCallback((nextIndex: number, dir: "next" | "prev") => {
    setDirection(dir);
    setIndex(nextIndex);
  }, []);

  const next = useCallback(() => {
    goTo((index + 1) % BANNER_SLIDES.length, "next");
  }, [index, goTo]);

  const prev = useCallback(() => {
    goTo((index - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length, "prev");
  }, [index, goTo]);

  useEffect(() => {
    const id = setInterval(next, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden">
      <button
        type="button"
        onClick={prev}
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md transition hover:bg-white hover:shadow-lg md:left-4"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-md transition hover:bg-white hover:shadow-lg md:right-4"
        aria-label="Slide siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        key={current.id}
        className={`relative flex w-full min-h-[540px] items-end justify-start px-6 pb-8 md:min-h-[720px] md:px-10 md:pb-10 ${current.bgColor}`}
        style={{
          animation: direction === "next" ? "banner-slide-in-right 0.5s ease-out forwards" : "banner-slide-in-left 0.5s ease-out forwards",
        }}
      >
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
