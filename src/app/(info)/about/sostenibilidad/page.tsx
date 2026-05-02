export default function SostenibilidadPage() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-6 text-sm leading-relaxed text-slate-700">
        <p>
          En ICOLTEX Importadora Textil creemos que los textiles pueden ser parte
          de un futuro más responsable. Por eso, trabajamos bajo principios de
          sostenibilidad que buscan reducir nuestro impacto ambiental y aportar
          al bienestar social.
        </p>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-red-600">
            Nuestros Pilares de Sostenibilidad
          </h2>

          <div className="space-y-4">
            <section className="grid gap-3 bg-slate-100/70 px-4 py-3 md:grid-cols-[1.25rem_1fr]">
              <div className="text-sm font-semibold text-red-600">1.</div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">
                  Uso Responsable de Materiales
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  <li>
                    Promovemos el uso de materiales reciclados y reutilizables
                    para disminuir residuos.
                  </li>
                  <li>
                    Priorizamos textiles provenientes de procesos más limpios y
                    eficientes.
                  </li>
                </ul>
              </div>
            </section>

            <section className="grid gap-3 bg-slate-100/70 px-4 py-3 md:grid-cols-[1.25rem_1fr]">
              <div className="text-sm font-semibold text-red-600">2.</div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">
                  Eficiencia en Procesos
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  <li>
                    Optimizamos el consumo de agua y energía en nuestras
                    operaciones.
                  </li>
                  <li>
                    Implementamos prácticas de logística que reducen emisiones de
                    transporte.
                  </li>
                </ul>
              </div>
            </section>

            <section className="grid gap-3 bg-slate-100/70 px-4 py-3 md:grid-cols-[1.25rem_1fr]">
              <div className="text-sm font-semibold text-red-600">3.</div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">
                  Compromiso Social
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  <li>
                    Trabajamos con proveedores que cumplen estándares éticos y
                    laborales.
                  </li>
                  <li>
                    Apoyamos iniciativas locales que promueven el desarrollo de
                    comunidades.
                  </li>
                </ul>
              </div>
            </section>

            <section className="grid gap-3 bg-slate-100/70 px-4 py-3 md:grid-cols-[1.25rem_1fr]">
              <div className="text-sm font-semibold text-red-600">4.</div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-900">
                  Innovación y Mejora Continua
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  <li>
                    Evaluamos constantemente nuevas tecnologías y procesos
                    sostenibles.
                  </li>
                  <li>
                    Escuchamos las sugerencias de nuestros clientes para mejorar
                    nuestras prácticas.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}

