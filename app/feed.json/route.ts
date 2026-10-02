import { ITEMS, byDate, itemHref, typeByKey } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** JSON Feed 1.1. The weekly digest script reads this to build the Monday email. */
export function GET() {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "DesignersDream",
    home_page_url: `${SITE_URL}/`,
    feed_url: `${SITE_URL}/feed.json`,
    items: [...ITEMS]
      .sort(byDate)
      .slice(0, 50)
      .map((i) => ({
        id: `${SITE_URL}${itemHref(i)}`,
        url: `${SITE_URL}${itemHref(i)}`,
        title: i.title,
        summary: i.excerpt,
        date_published: `${i.date}T06:00:00Z`,
        tags: [typeByKey(i.type).name],
      })),
  };
  return Response.json(feed);
}
