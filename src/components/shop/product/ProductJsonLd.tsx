import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  type ProductJsonLdInput,
} from "@/lib/seo";

type Props = {
  product: ProductJsonLdInput;
  breadcrumbs: { name: string; path?: string }[];
};

export function ProductJsonLd({ product, breadcrumbs }: Props) {
  const productSchema = buildProductJsonLd(product);
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
