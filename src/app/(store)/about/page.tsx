export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Sobre Icoltex
        </h1>
        <p className="text-sm text-slate-600">
          Somos una tienda especializada en telas para moda, hogar y proyectos
          de confección profesional.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">
            Nuestra historia
          </h2>
          <p>
            Icoltex nace con el propósito de ofrecer telas de alta calidad a
            talleres, marcas emergentes y creativos que necesitan un aliado
            confiable para sus colecciones.
          </p>
          <p>
            Cuidamos la selección de cada referencia para que tengas consistencia
            en color, textura y comportamiento de la tela en tus proyectos.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-slate-900">
            Qué nos diferencia
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Curaduría de colecciones por temporada.</li>
            <li>Asesoría personalizada para tus proyectos.</li>
            <li>Envíos rápidos y empaques pensados para taller.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
