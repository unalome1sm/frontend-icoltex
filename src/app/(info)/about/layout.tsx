import { InfoLayout } from "@/components/layout/InfoLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acerca de Icoltex",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <InfoLayout>{children}</InfoLayout>;
}
