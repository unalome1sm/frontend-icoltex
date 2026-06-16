import { Suspense } from "react";
import { ShopPageClient } from "./ShopPageClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-slate-500">Cargando…</div>}>
      <ShopPageClient />
    </Suspense>
  );
}
