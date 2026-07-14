import { noIndexMetadata } from "@/lib/seo";
import { CheckoutSuccessClient } from "./CheckoutSuccessClient";

export const metadata = noIndexMetadata("Pedido confirmado");

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutSuccessClient />
    </div>
  );
}
