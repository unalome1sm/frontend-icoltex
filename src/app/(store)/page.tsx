import { HomePage } from "@/components/home";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Tienda de Telas",
  description:
    "Compra telas de alta calidad en Icoltex. Catálogo online con envíos en Colombia, puntos de venta y asesoría textil.",
  path: "/",
});

export default function Home() {
  return <HomePage />;
}
