import Link from "next/link";

type TwoImageSectionProps = {
  /** URL de la imagen del panel izquierdo (tonos fríos). Si no se pasa, se usa placeholder. */
  imageLeft?: string;
  /** URL de la imagen del panel derecho (tonos cálidos/magenta). Si no se pasa, se usa placeholder. */
  imageRight?: string;
};

export function TwoImageSection({ imageLeft, imageRight }: TwoImageSectionProps) {
  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-2">
      {/* Panel izquierdo */}
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[2/1]">
        {imageLeft ? (
          <img
            src={imageLeft}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-slate-800"
            aria-hidden
          />
        )}
        <Link
          href="/shop"
          className="absolute bottom-4 left-4 z-10 rounded-sm bg-red-800 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-900"
        >
          Comprar
        </Link>
      </div>

      {/* Panel derecho */}
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[2/1]">
        {imageRight ? (
          <img
            src={imageRight}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-slate-900"
            style={{ filter: "hue-rotate(-30deg) saturate(1.2)" }}
            aria-hidden
          />
        )}
        <Link
          href="/shop"
          className="absolute bottom-4 left-4 z-10 rounded-sm bg-red-800 px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-red-900"
        >
          Comprar
        </Link>
      </div>
    </section>
  );
}
