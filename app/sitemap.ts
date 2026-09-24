import type { MetadataRoute } from "next";
import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";
import { LOCALES } from "@/lib/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, departments, services, news, events, facilities] = await Promise.all([
    db.doctor.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.department.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.service.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.news.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.hospitalEvent.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.facility.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/doctors",
    "/departments",
    "/services",
    "/news",
    "/events",
    "/facilities",
    "/faqs",
    "/emergency",
    "/gallery",
    "/careers",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        },
      });
    }
  }

  const addDynamic = (items: { slug: string; updatedAt: Date }[], prefix: string) => {
    for (const item of items) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE_URL}/${locale}/${prefix}/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map((l) => [l, `${SITE_URL}/${l}/${prefix}/${item.slug}`])
            ),
          },
        });
      }
    }
  };

  addDynamic(doctors, "doctors");
  addDynamic(departments, "departments");
  addDynamic(services, "services");
  addDynamic(news, "news");
  addDynamic(events, "events");
  addDynamic(facilities, "facilities");

  return entries;
}
