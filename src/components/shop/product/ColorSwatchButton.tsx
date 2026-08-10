"use client";

import { colorNameToSwatchStyle } from "@/lib/catalog";

type Props = {
  color: string;
  colorHex?: string;
  selected: boolean;
  onClick: () => void;
};

/** Círculo de color: prefer `colorHex` SAP; fallback por nombre. */
export function ColorSwatchButton({ color, colorHex, selected, onClick }: Props) {
  const swatch = colorNameToSwatchStyle(color, colorHex);

  const ringClass = selected
    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
    : "border-slate-200 hover:border-slate-400";

  return (
    <button
      type="button"
      onClick={onClick}
      title={color}
      aria-label={`Color ${color}`}
      style={{
        backgroundColor: swatch.backgroundColor,
        borderColor: swatch.borderColor ?? undefined,
      }}
      className={`h-8 w-8 shrink-0 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${ringClass}`}
    />
  );
}
