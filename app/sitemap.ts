import type { MetadataRoute } from "next";
import { DISCIPLINES, ITEMS, TYPES, itemHref } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    ...TYPES.map((t) => ({ url: `${SITE_URL}/${t.route}/`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...DISCIPLINES.map((d) => ({ url: `${SITE_URL}/discipline/${d.key}/`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...ITEMS.map((i) => ({ url: `${SITE_URL}${itemHref(i)}`, lastModified: i.date, priority: 0.7 })),
  ];
}
