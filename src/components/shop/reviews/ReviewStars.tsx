"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type StarSize = "sm" | "md" | "lg";

const sizeClass: Record<StarSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

type StarRatingDisplayProps = {
  value: number;
  max?: number;
  size?: StarSize;
  variant?: "amber" | "dark";
};

export function StarRatingDisplay({
  value,
  max = 5,
  size = "md",
  variant = "amber",
}: StarRatingDisplayProps) {
  const iconClass = sizeClass[size];
  const filledClass =
    variant === "dark" ? "fill-slate-900 text-slate-900" : "fill-amber-400 text-amber-400";
  const emptyClass = variant === "dark" ? "text-slate-300" : "text-slate-300";

  return (
    <div className="flex gap-0.5" aria-label={`${value} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            className={`${iconClass} ${filled ? filledClass : emptyClass}`}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

type StarRatingInputProps = {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
};

export function StarRatingInput({ value, onChange, disabled }: StarRatingInputProps) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const filled = star <= display;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="rounded p-0.5 transition hover:scale-110 disabled:opacity-50"
            aria-label={`${star} estrella${star === 1 ? "" : "s"}`}
          >
            <Star
              className={`h-7 w-7 ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
            />
          </button>
        );
      })}
    </div>
  );
}
