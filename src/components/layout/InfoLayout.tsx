"use client";

import { Footer } from "./Footer";
import { InfoSidebar } from "@/components/info/InfoSidebar";
import { ICOLTEX_INFO_SECTIONS } from "@/components/info/infoNav";
import { usePathname } from "next/navigation";

function getInfoTitle(pathname: string): string {
  for (const section of ICOLTEX_INFO_SECTIONS) {
    for (const item of section.items ?? []) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return item.label;
    }
    for (const group of section.groups ?? []) {
      for (const item of group.items) {
        if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
          return item.label;
        }
      }
    }
  }
  return "Acerca de Icoltex";
}

export function InfoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getInfoTitle(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1">
        <div className="hidden w-[18.5rem] shrink-0 lg:block">
          <div className="h-full max-h-screen overflow-y-auto">
            <InfoSidebar sections={ICOLTEX_INFO_SECTIONS} />
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:h-screen lg:overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-6 lg:sticky lg:top-0 lg:z-10 lg:bg-white">
            <h1 className="text-base font-semibold text-red-600">{title}</h1>
          </div>
          <div className="px-6 py-8 lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:pr-4">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

