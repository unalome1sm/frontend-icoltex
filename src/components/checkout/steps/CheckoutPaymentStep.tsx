"use client";

import type { PaymentData, PaymentMethod } from "../orderSnapshot";

type Props = {
  value: PaymentData;
  error: string | null;
  submitting: boolean;
  disabled: boolean;
  onChange: (next: PaymentData) => void;
  onSubmit: () => void;
  onBack: () => void;
};

const METHODS: { value: PaymentMethod; label: string; hint: string }[] = [
  {
    value: "transferencia",
    label: "Transferencia bancaria",
    hint: "Te enviaremos los datos de pago por correo o WhatsApp.",
  },
  {
    value: "pendiente",
    label: "Pago pendiente de confirmación",
    hint: "Un asesor confirmará el cobro contigo. La pasarela online se integrará más adelante.",
  },
];

export function CheckoutPaymentStep({
  value,
  error,
  submitting,
  disabled,
  onChange,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-4">
      <p className="mb-4 text-sm text-slate-600">
        El cobro se confirmará por un asesor o transferencia. La integración con
        pasarela de pagos (tarjeta / PSE) viene después.
      </p>
      <div className="space-y-3">
        {METHODS.map((m) => (
          <label
            key={m.value}
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
              value.method === m.value
                ? "border-red-500 bg-red-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={value.method === m.value}
              onChange={() => onChange({ ...value, method: m.value })}
              className="mt-1 h-4 w-4 accent-red-600"
            />
            <span>
              <span className="block text-sm font-medium text-slate-900">{m.label}</span>
              <span className="mt-0.5 block text-xs text-slate-600">{m.hint}</span>
            </span>
          </label>
        ))}
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={value.acceptTerms}
          onChange={(e) => onChange({ ...value, acceptTerms: e.target.checked })}
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
          {submitting ? "Confirmando…" : "Confirmar pedido"}
        </button>
      </div>
    </div>
  );
}
