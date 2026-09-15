export function ContactHero() {
  return (
    <section className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-red-600 px-8 py-8 text-center sm:px-10 sm:py-12 md:min-h-[280px] md:px-10 md:py-14">
        <div
          className="absolute inset-0 opacity-15"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q50 30 30 55 Q10 30 30 5' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
          Contáctanos
        </h1>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-white/95 sm:max-w-2xl sm:text-base md:text-lg">
          Estamos listos para asesorarte en telas, cotizaciones y proyectos
          textiles.
        </p>
      </div>
    </section>
  );
}
