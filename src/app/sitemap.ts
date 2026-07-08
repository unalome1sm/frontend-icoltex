import type { MetadataRoute } from "next";
import { ICOLTEX_INFO_SECTIONS } from "@/components/info/infoNav";
import { fetchGroupedProductsPage } from "@/lib/catalog";
import { getSiteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/contact",
  "/blog",
  "/stores",
  "/puntos-venta",
  "/about/politicas",
  "/about/promociones",
];

function collectAboutRoutes(): string[] {
  const routes: string[] = [];

  for (const section of ICOLTEX_INFO_SECTIONS) {
    if (section.items) {
      for (const item of section.items) {
        routes.push(item.href);
      }
    }
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          routes.push(item.href);
        }
      }
    }
  }

  return routes;
}

async function fetchAllProductRoutes(): Promise<string[]> {
  const routes: string[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await fetchGroupedProductsPage({ page, limit: 100 });
    for (const group of data.groups ?? []) {
      routes.push(`/shop/${group.groupId}`);
    }
    totalPages = data.pagination?.totalPages ?? 1;
    page += 1;
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [...STATIC_ROUTES, ...collectAboutRoutes()].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
    }),
  );

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const productRoutes = await fetchAllProductRoutes();
    productEntries = productRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...productEntries];
}
