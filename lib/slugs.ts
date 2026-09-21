import { db } from "@/lib/db";

export function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

type SlugModel = "doctor" | "department" | "service" | "news" | "hospitalEvent" | "career" | "page";

export async function uniqueSlug(model: SlugModel, source: string, excludeId?: string) {
  const client = (db as unknown as Record<SlugModel, { findFirst: (args: unknown) => Promise<{ id: string } | null> }>)[model];
  const base = slugify(source);
  let candidate = base;
  let suffix = 2;

  while (await client.findFirst({ where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
