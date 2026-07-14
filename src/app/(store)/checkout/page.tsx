import { CheckoutContent } from "@/components/checkout";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Checkout");

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutContent />
    </div>
  );
}
