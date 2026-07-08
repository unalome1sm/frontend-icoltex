export function BannerRojoSection() {
  return (
    <section
      className="relative flex min-h-[320px] w-full items-center justify-center overflow-hidden py-24 md:min-h-[480px] md:py-32"
      style={{
        backgroundColor: "#b91c1c",
        backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(127, 29, 29, 0.4), transparent),
                         linear-gradient(135deg, transparent 40%, rgba(127, 29, 29, 0.3) 50%, transparent 60%),
                         linear-gradient(225deg, transparent 30%, rgba(153, 27, 27, 0.25) 40%, transparent 50%)`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <p className="text-3xl font-bold uppercase tracking-widest text-white md:text-4xl lg:text-5xl">
          Abstract Background
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-white opacity-90"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
