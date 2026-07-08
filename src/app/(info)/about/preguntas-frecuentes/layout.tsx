import { aboutPageMetadata } from "@/lib/seo";

export const metadata = aboutPageMetadata("preguntas-frecuentes");

export default function PreguntasFrecuentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
