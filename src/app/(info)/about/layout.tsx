import { InfoLayout } from "@/components/layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Acerca de Icoltex",
  description:
    "Conoce la historia, políticas, garantías y tratamiento de datos de Icoltex, importadora y tienda de telas en Colombia.",
  path: "/about/nuestra-historia",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <InfoLayout>{children}</InfoLayout>;
}
