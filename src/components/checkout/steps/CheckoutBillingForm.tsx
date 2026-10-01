"use client";

import { DaneAddressFields } from "../address";
import type { BillingData } from "../orderSnapshot";

type Props = {
  value: BillingData;
  error: string | null;
  onChange: (next: BillingData) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function CheckoutBillingForm({ value, error, onChange, onSubmit, onBack }: Props) {
  return (
    <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
      <p className="mb-4 text-sm text-slate-600">Dirección donde se emite la factura.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        <DaneAddressFields idPrefix="billing" value={value} onChange={onChange} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Volver
          </button>
          <button
            type="submit"
            className="w-full flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
