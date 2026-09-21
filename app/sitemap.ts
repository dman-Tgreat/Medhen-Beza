import type { MetadataRoute } from "next";
import { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, departments, services, news, events] = await Promise.all([
    db.doctor.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.department.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.service.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.news.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
    db.hospitalEvent.findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticRoutes = ["/", "/about", "/contact", "/doctors", "/departments", "/services", "/news", "/events"].map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 }));
  const dynamic = (items: { slug: string; updatedAt: Date }[], prefix: string) => items.map((item) => ({ url: `${SITE_URL}/${prefix}/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 }));
  return [...staticRoutes, ...dynamic(doctors, "doctors"), ...dynamic(departments, "departments"), ...dynamic(services, "services"), ...dynamic(news, "news"), ...dynamic(events, "events")];
}
