import Image from "next/image";
import {
  HOME_BANNER_ROJO_IMAGE_DRIVE_URL,
  HOME_BANNER_ROJO_IMAGE_MOBILE_DRIVE_URL,
} from "@/config/homeMedia";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

function resolveBannerSrc(driveUrl: string): string {
  return getImageDisplayUrl(toDirectImageUrl(driveUrl));
}

const bannerMobileSrc = resolveBannerSrc(HOME_BANNER_ROJO_IMAGE_MOBILE_DRIVE_URL);
const bannerDesktopSrc = resolveBannerSrc(HOME_BANNER_ROJO_IMAGE_DRIVE_URL);

export function BannerRojoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-red-600">
      {/* Mobile + tablet: imagen completa, sin recorte */}
      <Image
        src={bannerMobileSrc}
        alt="Icoltex — telas y colecciones"
        width={1080}
        height={1440}
        className="block h-auto w-full lg:hidden"
        sizes="(max-width: 1023px) 100vw, 0px"
        unoptimized
      />

      {/* Desktop: banner panorámico */}
      <div className="relative hidden h-[400px] w-full lg:block">
        <Image
          src={bannerDesktopSrc}
          alt="Icoltex — telas y colecciones"
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 100vw, 0px"
          unoptimized
        />
      </div>
    </section>
  );
}
