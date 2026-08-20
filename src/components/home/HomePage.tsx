import { HOME_TWO_PANEL_IMAGES } from "@/config/homeMedia";
import { BannerCarousel } from "./banner/BannerCarousel";
import { TwoImageSection } from "./banner/TwoImageSection";
import { BannerRojoSection } from "./banner/BannerRojoSection";
import { DestacadosSection } from "./sections/DestacadosSection";
import { NovedadesDestacadosSection } from "./sections/NovedadesDestacadosSection";
import { NewsletterSection } from "./sections/NewsletterSection";

export function HomePage() {
  return (
    <div className="space-y-0">
      <h1 className="sr-only">Icoltex — Tienda de telas de alta calidad</h1>
      {/* Banner: 100% ancho y pegado a la barra de promoción */}
      <section
        className="-mt-8 w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <BannerCarousel />
      </section>
      {/* Dos imágenes debajo del banner (100% ancho) */}
      <section
        className="w-screen max-w-none"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <TwoImageSection
          imageLeft={HOME_TWO_PANEL_IMAGES.left}
          imageRight={HOME_TWO_PANEL_IMAGES.right}
        />
      </section>

      <div className="space-y-12 pt-12">
        <DestacadosSection />
        <div className="border-t border-slate-200" />
        <NovedadesDestacadosSection />
        <div className="border-t border-slate-200" />
        <div className="space-y-0">
          <section className="-mx-4 sm:-mx-6 lg:-mx-8">
            <BannerRojoSection />
          </section>
          <section className="-mx-4 sm:-mx-6 lg:-mx-8">
            <NewsletterSection />
          </section>
        </div>
      </div>
    </div>
  );
}


