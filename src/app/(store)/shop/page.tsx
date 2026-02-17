export default function ShopPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Shop
        </h1>
        <p className="text-sm text-slate-600">
          Explora nuestro catálogo de telas por tipo, color y uso. Más adelante
          aquí agregaremos filtros y destacados.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Grid de productos (pendiente de diseño). Aquí irán tarjetas de telas,
        filtros por categoría y ordenamiento.
      </div>
    </div>
  );
}
