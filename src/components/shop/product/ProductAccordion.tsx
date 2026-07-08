"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  headerExtra?: ReactNode;
};

export function ProductAccordion({ title, children, defaultOpen = false, headerExtra }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-medium text-slate-800"
      >
        <span>{title}</span>
        <span className="flex items-center gap-3">
          {headerExtra}
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>
      {open && <div className="pb-4 text-sm text-slate-600">{children}</div>}
    </div>
  );
}
