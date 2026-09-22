import type { Metadata } from "next";
import { HOSPITAL_INFO } from "@/lib/constants";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function descriptionFallback(value: string | undefined, fallback: string) {
  const text = (value || fallback).replace(/\s+/g, " ").trim();
  return text.length > 170 ? `${text.slice(0, 167).trimEnd()}...` : text;
}

export function contentMetadata(input: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  canonicalUrl?: string | null;
  type?: "website" | "article";
  siteName?: string;
}): Metadata {
  const description = descriptionFallback(input.description, HOSPITAL_INFO.description);
  const url = absoluteUrl(input.canonicalUrl || input.path);
  const image = input.image ? absoluteUrl(input.image) : undefined;
  return {
    title: input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type || "website",
      url,
      title: input.title,
      description,
      siteName: input.siteName || HOSPITAL_INFO.name,
      ...(image ? { images: [{ url: image, alt: input.title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: input.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function hospitalJsonLd(settings?: {
  hospitalName?: string;
  description?: string;
  generalPhone?: string;
  address?: string;
  city?: string;
  country?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: settings?.hospitalName || HOSPITAL_INFO.name,
    description: settings?.description || HOSPITAL_INFO.description,
    url: SITE_URL,
    telephone: settings?.generalPhone || HOSPITAL_INFO.generalPhone,
    image: absoluteUrl("/og-image.jpg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings?.address || HOSPITAL_INFO.address,
      addressLocality: settings?.city || "Adama",
      addressCountry: settings?.country || "ET",
    },
    openingHours: "Mo-Su 00:00-23:59",
  };
}

export function hospitalReference(settings?: { hospitalName?: string }) {
  return { "@type": "Hospital", name: settings?.hospitalName || HOSPITAL_INFO.name, url: SITE_URL };
}
