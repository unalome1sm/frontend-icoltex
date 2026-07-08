import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="space-y-4 py-8">
      <h1 className="text-xl font-semibold text-slate-900">Producto no encontrado</h1>
      <p className="text-slate-500">El producto que buscas no existe o ya no está disponible.</p>
      <Link href="/shop" className="text-sm text-slate-600 hover:underline">
        ← Volver a la tienda
      </Link>
    </div>
  );
}
