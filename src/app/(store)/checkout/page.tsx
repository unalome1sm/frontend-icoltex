export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Checkout
        </h1>
        <p className="text-sm text-slate-600">
          Completa tus datos para realizar el pedido. Más adelante conectaremos
          este flujo con un procesador de pagos real.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
        <form className="space-y-4 rounded-2xl border bg-white p-6 text-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Datos de envío
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
                placeholder="Ej. Ana Pérez"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Teléfono
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
                placeholder="Ej. +57 300 000 0000"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Dirección
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
              placeholder="Calle 00 # 00 - 00, apto / taller"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Ciudad
              </label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Departamento
              </label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Código postal
              </label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2" />
            </div>
          </div>

          <h2 className="mt-4 text-base font-semibold text-slate-900">
            Método de pago
          </h2>
          <p className="text-xs text-slate-500">
            Por ahora este formulario es solo de diseño. Luego integraremos el
            medio de pago que definas (ej. Wompi, MercadoPago, etc.).
          </p>
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Confirmar pedido
          </button>
        </form>

        <aside className="space-y-4 rounded-2xl border bg-white p-6 text-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Resumen de compra
          </h2>
          <p className="text-xs text-slate-500">
            Aquí se listarán las telas que el cliente tenga en el carrito, con
            su cantidad en metros, subtotal y costo de envío.
          </p>
          <div className="mt-2 space-y-1 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>Por calcular</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>$0</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
