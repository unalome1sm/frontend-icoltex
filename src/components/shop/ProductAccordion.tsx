"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function ProductAccordion({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-medium text-slate-800"
      >
        <span>{title}</span>
        {open ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" />
        )}
      </button>
      {open && <div className="pb-4 text-sm text-slate-600">{children}</div>}
    </div>
  );
}
