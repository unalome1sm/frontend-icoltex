import Link from "next/link";

const PROMO_TERMS = [
  {
    label: "T&C - Cyber black (Digital) 40% OFF",
    href: "/about/promociones/cyber-black-digital-40",
  },
];

export default function PromocionesPage() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Aquí puedes consultar los términos y condiciones de las promociones
          publicadas por IMPORTADORA ICOLTEX S.A.S.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          {PROMO_TERMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-medium text-red-600 underline underline-offset-2 hover:text-red-700"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

