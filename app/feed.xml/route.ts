import { ITEMS, byDate, itemHref, typeByKey } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 feed of everything we publish, newest first. */
export function GET() {
  const items = [...ITEMS].sort(byDate).slice(0, 50);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>DesignersDream</title>
<link>${SITE_URL}/</link>
<description>News, tips, software, AI models and videos for every kind of designer.</description>
<language>en</language>
<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${SITE_URL}${itemHref(i)}</link>
<guid>${SITE_URL}${itemHref(i)}</guid>
<pubDate>${new Date(i.date + "T06:00:00Z").toUTCString()}</pubDate>
<category>${esc(typeByKey(i.type).name)}</category>
<description>${esc(i.excerpt)}</description>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
