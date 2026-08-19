import Image from "next/image";
import { HOME_BANNER_ROJO_IMAGE_DRIVE_URL } from "@/config/homeMedia";
import { getImageDisplayUrl, toDirectImageUrl } from "@/lib/products";

const bannerSrc = getImageDisplayUrl(
  toDirectImageUrl(HOME_BANNER_ROJO_IMAGE_DRIVE_URL),
);

export function BannerRojoSection() {
  return (
    <section className="relative min-h-[320px] w-full overflow-hidden md:min-h-[480px]">
      <Image
        src={bannerSrc}
        alt="Icoltex — telas y colecciones"
        fill
        className="object-cover object-center"
        sizes="100vw"
        unoptimized
      />
    </section>
  );
}
