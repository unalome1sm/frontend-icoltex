import { Suspense } from "react";
import { StoresPuntosVentaPage } from "@/components/stores/StoresPuntosVentaPage";

function StoresPageFallback() {
  return (
    <div className="min-h-screen animate-pulse bg-white">
      <div className="-mt-8 h-[320px] w-screen max-w-none bg-red-600/90 md:h-[420px]" style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }} />
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
