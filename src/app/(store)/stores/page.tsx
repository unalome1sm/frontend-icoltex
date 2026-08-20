import { Suspense } from "react";
import { StoresPuntosVentaPage } from "@/components/stores/StoresPuntosVentaPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Puntos de venta",
  description:
    "Encuentra los puntos de venta y showrooms de Icoltex en Colombia. Horarios, ubicación y asesoría presencial.",
  path: "/stores",
});

function StoresPageFallback() {
  return (
    <div className="min-h-screen animate-pulse bg-white">
      <div className="-mx-4 -mt-8 h-32 bg-red-600/90 sm:-mx-6 sm:h-36 md:min-h-[280px] lg:-mx-8" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-4 flex gap-2">
          <div className="h-9 w-28 rounded-full bg-slate-100" />
          <div className="h-9 w-20 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={<StoresPageFallback />}>
      <StoresPuntosVentaPage />
    </Suspense>
  );
}
