export function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-12 text-slate-50 md:grid-cols-2 md:px-10 md:py-16">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Icoltex · Telas profesionales
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Telas premium para{" "}
            <span className="text-slate-200">moda, hogar y confección</span>.
          </h1>
          <p className="text-sm text-slate-200/80 sm:text-base">
            Encuentra algodones, linos, sedas y textiles técnicos con stock
            inmediato y cortes desde 1 metro. Pensado para talleres, diseñadores
            y marcas que necesitan calidad constante.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white"
            >
              Ver catálogo
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300/60 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-50 transition hover:bg-slate-900/40"
            >
              Hablar con asesor
            </a>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-4 text-xs text-slate-200/80 sm:text-sm">
            <div>
              <dt className="font-semibold text-slate-50">+500</dt>
              <dd>Referencias de telas</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-50">48h</dt>
              <dd>Envíos a ciudades principales</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-50">1m</dt>
              <dd>Compra mínima por referencia</dd>
            </div>
          </dl>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-200" />
            <div className="h-32 rounded-2xl bg-slate-300" />
            <div className="h-32 rounded-2xl bg-slate-400" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Categorías principales
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Algodón", "Lino", "Seda", "Estampados"].map((category) => (
            <div
              key={category}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-slate-900">{category}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Telas seleccionadas para proyectos de alta calidad.
                </p>
              </div>
              <a
                href="/shop"
                className="mt-3 inline-flex text-xs font-semibold text-slate-900 underline-offset-2 hover:underline"
              >
                Ver telas
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Novedades del blog
        </h2>
        <p className="text-sm text-slate-500">
          Pronto encontrarás guías de cuidado, tendencias de color y tips para
          optimizar el consumo de tela en tus proyectos.
        </p>
      </section>
    </div>
  );
}


