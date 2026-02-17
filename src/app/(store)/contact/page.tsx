export default function ContactPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Contáctanos
        </h1>
        <p className="text-sm text-slate-600">
          Cuéntanos qué tipo de telas buscas o qué proyecto tienes y te
          ayudaremos a elegir las mejores opciones.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <form className="space-y-4 rounded-2xl border bg-white p-6 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Nombre
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
                placeholder="Tu nombre"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Correo
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
                placeholder="tu@correo.com"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Mensaje
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:ring-2"
              placeholder="Cuéntanos qué telas necesitas, cantidades aproximadas, usos, etc."
            />
          </div>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Enviar mensaje
          </button>
        </form>

        <aside className="space-y-3 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">
            Otros canales
          </h2>
          <p>
            También puedes escribirnos por WhatsApp o visitarnos en nuestro
            showroom (si aplica).
          </p>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-medium text-slate-900">Teléfono: </span>
              +57 300 000 0000
            </li>
            <li>
              <span className="font-medium text-slate-900">Correo: </span>
              contacto@icoltex.com
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
