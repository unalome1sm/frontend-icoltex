"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { InfoNavSection } from "./infoNav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function InfoSidebar({
  sections,
  brand = "ICOLTEX",
}: {
  sections: InfoNavSection[];
  brand?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="h-full w-full border-r border-slate-200 bg-white">
      <div className="px-6 py-6">
        <Link href="/" aria-label="Ir al inicio">
          <Image
            src="/icons/LOGOS-02.svg"
            alt={brand}
            width={1920}
            height={1080}
            className="h-10 w-auto max-w-[10.5rem] object-contain object-left sm:h-16 sm:max-w-[18.5rem] md:max-w-[16rem] lg:max-w-[18.5rem]"
            priority
            unoptimized
          />
        </Link>
      </div>

      <nav className="px-4 pb-10">
        <div className="space-y-5">
          {sections.map((section) => (
            <details key={section.label} open className="group">
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
                      className={[
                        "block rounded-md px-4 py-2 text-sm",
                        active
                          ? "border-l-4 border-red-600 bg-red-50 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {section.groups?.map((group) => (
                  <details key={group.label} open className="group">
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
                            className={[
                              "block rounded-md px-4 py-2 text-sm",
                              active
                                ? "border-l-4 border-red-600 bg-red-50 text-slate-900"
                                : "text-slate-700 hover:bg-slate-50",
                            ].join(" ")}
                            aria-current={active ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </nav>
    </aside>
  );
}
