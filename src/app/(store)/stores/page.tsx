import { Suspense } from "react";
import { StoresPageContent } from "@/components/stores/StoresPageContent";

function StoresPageFallback() {
  return (
    <div className="min-h-screen animate-pulse bg-white">
      <div className="-mt-8 h-[320px] w-screen max-w-none bg-red-600/90 md:h-[420px]" style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="mt-4 h-12 max-w-md rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

export default function StoresPage() {
  return (
    <Suspense fallback={<StoresPageFallback />}>
      <StoresPageContent />
    </Suspense>
  );
}
