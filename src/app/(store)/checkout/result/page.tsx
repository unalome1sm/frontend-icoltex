import { Suspense } from "react";
import { noIndexMetadata } from "@/lib/seo";
import { CheckoutResultClient } from "./CheckoutResultClient";

export const metadata = noIndexMetadata("Resultado del pago");

export default function CheckoutResultPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Cargando…
          </div>
        }
      >
        <CheckoutResultClient />
      </Suspense>
    </div>
  );
}
