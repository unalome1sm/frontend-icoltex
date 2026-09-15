import Image from "next/image";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_HEADQUARTERS,
  CONTACT_HOURS,
  CONTACT_PHONE,
  CONTACT_SOCIAL_LINKS,
} from "@/lib/contact";

const CARD_GRADIENT =
  "linear-gradient(180deg, #DC1617 0%, #9F0D0E 100%)";

export function ContactInfoCard() {
  return (
    <aside
      className="flex h-full min-h-0 flex-col rounded-2xl p-6 text-white shadow-xl sm:p-8 lg:sticky lg:top-24 lg:self-stretch"
      style={{ background: CARD_GRADIENT }}
    >
      <h2 className="shrink-0 text-[25px] font-semibold leading-none tracking-normal text-white">
        Información de contacto
      </h2>

      <div className="mt-8 flex flex-1 flex-col justify-between gap-8 text-sm">
        <div>
          <p className="font-semibold">{CONTACT_HEADQUARTERS.label}</p>
          {CONTACT_HEADQUARTERS.addressLines.map((line) => (
            <p key={line} className="mt-1 text-white/95">
              {line}
            </p>
          ))}
        </div>

        <div>
          <p className="font-semibold">{CONTACT_PHONE.label}</p>
          <a
            href={CONTACT_PHONE.href}
            className="mt-1 block text-white/95 underline-offset-2 hover:underline"
          >
            {CONTACT_PHONE.display}
          </a>
        </div>

        <div>
          <p className="font-semibold">{CONTACT_EMAIL.label}</p>
          <a
            href={CONTACT_EMAIL.href}
            className="mt-1 block text-white/95 underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL.display}
          </a>
        </div>

        <div>
          <p className="font-semibold">{CONTACT_HOURS.label}</p>
          {CONTACT_HOURS.lines.map((line) => (
            <p key={line} className="mt-1 text-white/95">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-10 shrink-0 border-t border-white/20 pt-6">
        <p className="text-sm font-semibold">Síguenos</p>
        <div className="mt-3 flex flex-wrap gap-2.5" aria-label="Redes sociales">
          {CONTACT_SOCIAL_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              aria-label={link.label}
              className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full transition hover:opacity-90"
            >
              <Image
                src={link.iconSrc}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
