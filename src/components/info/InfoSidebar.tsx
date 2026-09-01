"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { InfoNavGroup, InfoNavSection } from "./infoNav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupContainsPath(group: InfoNavGroup, pathname: string) {
  return group.items.some(
    (item) => isActive(pathname, item.href) || item.href.startsWith(`${pathname}/`),
  );
}

function sectionContainsPath(section: InfoNavSection, pathname: string) {
  if (
    section.items?.some(
      (item) => isActive(pathname, item.href) || item.href.startsWith(`${pathname}/`),
    )
  ) {
    return true;
  }
  return section.groups?.some((group) => groupContainsPath(group, pathname)) ?? false;
}

function navLinkClassName(active: boolean) {
  return [
    "block rounded-md px-4 py-2 text-sm",
    active
      ? "border-l-4 border-red-600 bg-red-50 text-slate-900"
      : "text-slate-700 hover:bg-slate-50",
  ].join(" ");
}

function InfoGroupDetails({
  group,
  pathname,
  onNavigate,
}: {
  group: InfoNavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(() => groupContainsPath(group, pathname));

  useEffect(() => {
    if (groupContainsPath(group, pathname)) setOpen(true);
  }, [group, pathname]);

  return (
    <details
      className="group"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="mt-2 flex cursor-pointer list-none items-center justify-between rounded-md border-l-4 border-red-600 bg-red-50 px-4 py-2 text-sm font-medium text-slate-900">
        <span>{group.label}</span>
        <span className="text-slate-600">▾</span>
      </summary>
      <div className="mt-1 space-y-1 pl-4">
        {group.items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={navLinkClassName(active)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </details>
  );
}

function InfoSectionDetails({
  section,
  pathname,
  onNavigate,
}: {
  section: InfoNavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(() => sectionContainsPath(section, pathname));

  useEffect(() => {
    if (sectionContainsPath(section, pathname)) setOpen(true);
  }, [pathname, section]);

  return (
    <details
      className="group"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border-l-4 border-red-600 bg-red-50 px-4 py-2 text-sm font-medium text-slate-900">
        <span>{section.label}</span>
        <span className="text-slate-600">▾</span>
      </summary>

      <div className="mt-1 space-y-1 pl-4">
        {section.items?.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={navLinkClassName(active)}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        {section.groups?.map((group) => (
          <InfoGroupDetails
            key={group.label}
            group={group}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </details>
  );
}

export function InfoSidebar({
  sections,
  brand = "ICOLTEX",
  showBrand = true,
  onNavigate,
}: {
  sections: InfoNavSection[];
  brand?: string;
  showBrand?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={`h-full w-full bg-white ${showBrand ? "border-r border-slate-200" : ""}`}>
      {showBrand && (
        <div className="px-6 py-6">
          <Link href="/" aria-label="Ir al inicio">
            <Image
              src="/icons/LOGOS-02.svg"
              alt={brand}
              width={1070}
              height={195}
              className="m-0 block h-5 w-auto object-contain object-left p-0"
              priority
              unoptimized
            />
          </Link>
        </div>
      )}

      <nav className="px-4 pb-10">
        <div className="space-y-5">
          {sections.map((section) => (
            <InfoSectionDetails
              key={section.label}
              section={section}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
