import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icoltex · Tienda de Telas",
  description: "E‑commerce de telas de alta calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
