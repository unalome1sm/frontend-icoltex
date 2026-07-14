"use client";

type Props = {
  error: string | null;
  submitting: boolean;
  disabled: boolean;
  acceptTerms: boolean;
  onAcceptTermsChange: (value: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function CheckoutPaymentStep({
  error,
  submitting,
  disabled,
  acceptTerms,
  onAcceptTermsChange,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Pagar con Wompi</p>
        <p className="mt-1 text-sm text-slate-600">
          Serás redirigido a la pasarela segura de Wompi para pagar con tarjeta,
          PSE u otros métodos. No almacenamos datos de tu tarjeta.
        </p>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => onAcceptTermsChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-red-600"
        />
        <span className="text-sm text-slate-700">
          Acepto los términos de compra y el tratamiento de datos personales.
        </span>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
        >
          Volver
        </button>
        <button
          type="button"
          disabled={disabled || submitting}
          onClick={onSubmit}
          className="w-full flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? "Redirigiendo a Wompi…" : "Pagar con Wompi"}
        </button>
      </div>
    </div>
  );
}
