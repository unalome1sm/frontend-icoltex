import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { ShopPageClient } from "./ShopPageClient";

export const metadata = pageMetadata({
  title: "Catálogo de telas",
  description:
    "Explora el catálogo de telas Icoltex. Filtra por categoría, color y precio. Compra online con stock actualizado.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-slate-500">Cargando…</div>}>
      <ShopPageClient />
    </Suspense>
  );
}
