export default function BlogPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Blog
        </h1>
        <p className="text-sm text-slate-600">
          Artículos sobre tendencias en telas, consejos de confección y cuidado
          de textiles. Muy pronto empezaremos a publicar contenido aquí.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Listado de posts (pendiente de diseño). Aquí podrás listar entradas del
        blog y filtros por tema.
      </div>
    </div>
  );
}
