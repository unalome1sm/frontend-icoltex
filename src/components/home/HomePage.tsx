import { HOME_TWO_PANEL_IMAGES } from "@/config/homeMedia";
import { BannerCarousel } from "./BannerCarousel";
import { TwoImageSection } from "./TwoImageSection";
import { DestacadosSection } from "./DestacadosSection";
import { NovedadesDestacadosSection } from "./NovedadesDestacadosSection";
import { BannerRojoSection } from "./BannerRojoSection";
import { NewsletterSection } from "./NewsletterSection";

export function HomePage() {
  return (
    <div className="space-y-0">
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
          <section
            className="relative left-1/2 w-screen max-w-none -translate-x-1/2"
          >
            <BannerRojoSection />
          </section>
          <section
            className="relative left-1/2 w-screen max-w-none -translate-x-1/2"
          >
            <NewsletterSection />
          </section>
        </div>

     


      </div>
    </div>
  );
}


