import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { DEFAULT_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const sarabun = Sarabun({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} · Tienda de Telas`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · Tienda de Telas`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Tienda de Telas`,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sarabun.className} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
