import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail, ProductJsonLd } from "@/components/shop";
import { loadProductPageData } from "@/lib/products";
import { pageMetadata, toAbsoluteImageUrl } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await loadProductPageData(id);
  if (!data) {
    return { title: "Producto no encontrado" };
  }

  const title = data.tituloVitrina ?? data.product.nombre;
  const description =
    data.product.descripcionCorta?.trim() ||
    data.product.caracteristicasGrupo?.trim() ||
    data.product.caracteristica?.trim() ||
    `Compra ${title} en Icoltex. Telas de alta calidad con envío en Colombia.`;

  return pageMetadata({
    title,
    description,
    path: `/shop/${data.canonicalId}`,
    image: data.product.imageUrls?.[0],
  });
}

export default async function ShopProductPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadProductPageData(id);

  if (!data) {
    notFound();
  }

  const heading = data.tituloVitrina ?? data.product.nombre;
  const lineaComercial = data.grouped?.filtros
    ?.flatMap((f) => f.filtro1 ?? [])
    .find((v) => v?.trim());
  const breadcrumbItems = [
    { name: "Tienda", path: "/shop" },
    ...(lineaComercial
      ? [{ name: lineaComercial, path: `/shop?linea=${encodeURIComponent(lineaComercial)}` }]
      : []),
    ...(data.tituloVitrina && data.tituloVitrina !== heading
      ? [
          {
            name: data.tituloVitrina,
            path: lineaComercial
              ? `/shop?linea=${encodeURIComponent(lineaComercial)}&nombre=${encodeURIComponent(data.tituloVitrina)}`
              : `/shop?nombre=${encodeURIComponent(data.tituloVitrina)}`,
          },
        ]
      : []),
    { name: heading },
  ];

  return (
    <>
      <ProductJsonLd
        product={{
          id: data.canonicalId,
          name: heading,
          description:
            data.product.descripcionCorta ||
            data.product.caracteristicasGrupo ||
            data.product.caracteristica,
          imageUrls: data.product.imageUrls?.map((url) => toAbsoluteImageUrl(url) ?? url),
          price: data.product.precioMetro,
          inStock: data.product.stock > 0,
          sku: data.product.codigo,
          category: data.product.lineaComercial || data.product.categoria,
        }}
        breadcrumbs={breadcrumbItems}
      />
      <ProductDetail
        product={data.product}
        relatedProducts={data.related}
        tituloVitrina={data.tituloVitrina}
        variantes={data.variantes}
        variantesGroupId={data.variantesGroupId}
        groupImageUrls={data.groupImageUrls}
      />
    </>
  );
}
