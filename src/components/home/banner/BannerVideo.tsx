"use client";

import { useEffect, useRef } from "react";

type BannerVideoProps = {
  src: string;
  className?: string;
  onBroken?: () => void;
};

function releaseVideo(el: HTMLVideoElement) {
  el.pause();
  el.removeAttribute("src");
  el.load();
}

export function BannerVideo({
  src,
  className = "h-full w-full object-cover object-center",
  onBroken,
}: BannerVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      el.defaultMuted = true;
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          if (el.getAttribute("src") !== src) {
            el.src = src;
            el.load();
          }
          tryPlay();
          return;
        }

        el.pause();
      },
      { rootMargin: "120px 0px" },
    );

    el.addEventListener("canplay", tryPlay);
    observer.observe(el);

    return () => {
      el.removeEventListener("canplay", tryPlay);
      observer.disconnect();
      releaseVideo(el);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      controls={false}
      disablePictureInPicture
      onError={onBroken}
      aria-hidden
    />
  );
}
