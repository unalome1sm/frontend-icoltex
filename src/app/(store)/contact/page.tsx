import { ContactPage } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contáctanos",
  description:
    "Escríbenos para recibir asesoría sobre telas, cotizaciones y proyectos textiles. Atención por correo, teléfono y WhatsApp.",
  path: "/contact",
});

export default function ContactRoutePage() {
  return <ContactPage />;
}
