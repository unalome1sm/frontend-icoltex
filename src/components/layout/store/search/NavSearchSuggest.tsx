"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import {
  flattenNavSearchSuggestions,
  getNavSearchSuggestions,
  shopUrlForSearch,
  type CatalogFilterMeta,
  type NavSearchSuggestion,
} from "@/lib/catalog";
import { resolveStoresSearchUrl } from "@/data/stores";

type NavSearchSuggestProps = {
  meta: CatalogFilterMeta | null;
  onNavigate?: () => void;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  variant?: "desktop" | "mobile";
};

const DEBOUNCE_MS = 250;

export function NavSearchSuggest({
  meta,
  onNavigate,
  className = "",
  inputClassName = "",
  iconClassName = "",
  variant = "desktop",
}: NavSearchSuggestProps) {
  const router = useRouter();
  const listboxId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const groups = useMemo(
    () => getNavSearchSuggestions(debouncedQuery, meta),
    [debouncedQuery, meta],
  );

  const flat = useMemo(() => flattenNavSearchSuggestions(groups), [groups]);
  const hasSuggestions = flat.length > 0;
  const showPanel = open && debouncedQuery.trim().length >= 2 && hasSuggestions;

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function navigateTo(href: string) {
    setOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(href);
  }

  function resolveSubmitUrl(value: string): string {
    return resolveStoresSearchUrl(value) ?? shopUrlForSearch(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (showPanel && activeIndex >= 0 && flat[activeIndex]) {
      navigateTo(flat[activeIndex].href);
      return;
    }
    navigateTo(resolveSubmitUrl(query));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!showPanel && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (hasSuggestions && debouncedQuery.trim().length >= 2) {
        setOpen(true);
      }
      return;
    }

    if (!showPanel) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flat.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? flat.length - 1 : prev - 1));
    }
  }

  function renderSuggestion(
    item: NavSearchSuggestion,
    flatIndex: number,
  ) {
    const isActive = flatIndex === activeIndex;
    const Icon = item.kind === "store" ? MapPin : Search;

    return (
      <Link
        key={item.id}
        id={`${listboxId}-option-${flatIndex}`}
        href={item.href}
        role="option"
        aria-selected={isActive}
        onMouseEnter={() => setActiveIndex(flatIndex)}
        onClick={(e) => {
          e.preventDefault();
          navigateTo(item.href);
        }}
        className={`flex items-start gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
          isActive ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <Icon
          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
            item.kind === "store" ? "text-red-600" : "text-slate-400"
          }`}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{item.label}</span>
          {item.kind === "store" && item.subtitle ? (
            <span className="block truncate text-xs text-slate-500">{item.subtitle}</span>
          ) : null}
        </span>
      </Link>
    );
  }

  return (
    <form
      ref={rootRef}
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      role="search"
    >
      <Search
        className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 ${iconClassName}`}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar productos o tiendas..."
        className={inputClassName}
        aria-label="Buscar productos o tiendas"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={showPanel}
        aria-activedescendant={
          showPanel && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        autoComplete="off"
      />

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg ${
            variant === "mobile" ? "left-0 right-0 min-w-0" : "min-w-[16rem]"
          }`}
        >
          {groups.stores.length > 0 ? (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Puntos de venta
              </p>
              {groups.stores.map((item, index) => renderSuggestion(item, index))}
            </div>
          ) : null}

          {groups.products.length > 0 ? (
            <div>
              {groups.stores.length > 0 ? (
                <div className="my-1 border-t border-slate-100" />
              ) : null}
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Productos
              </p>
              {groups.products.map((item, index) =>
                renderSuggestion(item, groups.stores.length + index),
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
