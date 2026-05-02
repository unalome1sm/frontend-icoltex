import Link from "next/link";

const POLICY_LINKS = [
  { label: "Condiciones generales", href: "/about/condiciones-generales" },
  { label: "Qué cubre la garantía", href: "/about/que-cubre-la-garantia" },
  { label: "Condiciones para que aplique", href: "/about/condiciones-para-que-aplique" },
  { label: "Cómo hacer un reclamo", href: "/about/como-hacer-un-reclamo" },
  { label: "Tiempos de respuesta", href: "/about/tiempos-de-respuesta" },
  { label: "Soluciones posibles", href: "/about/soluciones-posibles" },
  { label: "Información adicional", href: "/about/informacion-adicional" },
];

export default function PoliticasPage() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          En esta sección encuentras las políticas de garantías y devoluciones de
          IMPORTADORA ICOLTEX S.A.S.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          {POLICY_LINKS.map((item) => (
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

