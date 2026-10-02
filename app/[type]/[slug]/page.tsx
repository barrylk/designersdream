import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import ContentCard from "@/components/ContentCard";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";
import VideoPlayer from "@/components/VideoPlayer";
import Subscribe from "@/components/Subscribe";
import { AUTHORS } from "@/lib/authors";
import {
  ITEMS,
  byDate,
  disciplineByKey,
  findItem,
  formatDate,
  typeByKey,
  typeByRoute,
  type Item,
} from "@/lib/content";
import { ADSENSE_SLOTS, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ITEMS.map((i) => ({ type: typeByKey(i.type).route, slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string; slug: string }> }): Promise<Metadata> {
  const { type, slug } = await params;
  const item = findItem(type, slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/${type}/${slug}/` },
    openGraph: { title: item.title, description: item.excerpt, type: item.type === "article" ? "article" : "website" },
  };
}

/** Tiny renderer for our body format: "## " headings, "- " bullets, "1. " steps, else paragraphs. */
function Body({ lines, adAfter = 0 }: { lines: string[]; adAfter?: number }) {
  let paragraphs = 0;
  const out: React.ReactNode[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.kind;
    out.push(
      <Tag key={out.length}>
        {list.items.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </Tag>,
    );
    list = null;
  };
  for (const line of lines) {
    const bullet = line.startsWith("- ");
    const step = /^\d+\.\s/.test(line);
    if (bullet || step) {
      const kind = bullet ? "ul" : "ol";
      if (!list || list.kind !== kind) {
        flush();
        list = { kind, items: [] };
      }
      list.items.push(line.replace(/^(- |\d+\.\s)/, ""));
      continue;
    }
    flush();
    if (line.startsWith("## ")) out.push(<h2 key={out.length}>{line.slice(3)}</h2>);
    else {
      out.push(<p key={out.length}>{line}</p>);
      paragraphs++;
      if (paragraphs === adAfter) out.push(<AdSlot key="ad" slot={ADSENSE_SLOTS.inArticle} className="ad-inline" />);
    }
  }
  flush();
  return <>{out}</>;
}

function Facts({ item }: { item: Item }) {
  const rows: [string, React.ReactNode][] = [];
  const m = item.meta ?? {};
  if (m.maker) rows.push(["Made by", m.maker]);
  if (m.modality) rows.push(["Makes", m.modality]);
  if (m.platforms) rows.push(["Runs on", m.platforms]);
  if (m.pricing) rows.push(["Pricing", m.pricing]);
  if (m.tool) rows.push(["Tool", m.tool]);
  if (m.handle) rows.push(["Channel", m.handle]);
  if (item.readMins) rows.push(["Reading time", `${item.readMins} minutes`]);
  rows.push(["Published", formatDate(item.date)]);
  rows.push([
    "Disciplines",
    <span key="d" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {item.disciplines.map((d) => (
        <Link key={d} href={`/discipline/${d}/`} className="chip">
          <span className="dot" style={{ ["--c" as string]: disciplineByKey(d).color }} />
          {disciplineByKey(d).name}
        </Link>
      ))}
    </span>,
  ]);
  return (
    <dl className="detail-aside">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
      {m.url && (
        <div>
          <a className="btn btn-solid" href={m.url} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: "0 18px", fontSize: 14 }}>
            {m.linkLabel ?? "Visit website"}
          </a>
        </div>
      )}
    </dl>
  );
}

export default async function DetailPage({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  const item = findItem(type, slug);
  const t = typeByRoute(type);
  if (!item || !t) notFound();

  const related = ITEMS.filter((i) => i.slug !== item.slug && i.disciplines.some((d) => item.disciplines.includes(d)))
    .sort(byDate)
    .slice(0, 3);

  const author = item.author ? AUTHORS[item.author] : undefined;
  const jsonLd =
    item.type === "article" || item.type === "news"
      ? {
          "@context": "https://schema.org",
          "@type": item.type === "news" ? "NewsArticle" : "Article",
          headline: item.title,
          description: item.excerpt,
          datePublished: item.date,
          url: `${SITE_URL}/${type}/${slug}/`,
          ...(author ? { author: { "@type": "Person", name: author.name, url: `${SITE_URL}/author/${author.key}/` } } : {}),
          publisher: { "@type": "Organization", name: "DesignersDream" },
          ...(item.sources?.length ? { isBasedOn: item.sources.map((x) => x.url) } : {}),
        }
      : item.type === "software"
        ? { "@context": "https://schema.org", "@type": "SoftwareApplication", name: item.title, description: item.excerpt, applicationCategory: "DesignApplication", url: item.meta?.url }
        : { "@context": "https://schema.org", "@type": "WebPage", name: item.title, description: item.excerpt };

  return (
    <article>
      {(item.type === "article" || item.type === "news") && <ReadingProgress />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap detail-hero">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${t.route}/`}>{t.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{item.title}</span>
        </nav>
        <Reveal>
          <h1 className={`detail-title${item.title.length > 38 ? " detail-title-long" : ""}`} data-reveal>
            {item.title}
          </h1>
        </Reveal>
        <p className="detail-lede">{item.excerpt}</p>
        {author && (
          <div className="byline">
            <Link href={`/author/${author.key}/`} className="byline-author">
              <span className="author-avatar" aria-hidden="true">
                {author.initial}
              </span>
              <span>
                <span className="byline-name">By {author.name}</span>
                <span className="byline-meta">
                  {formatDate(item.date)}
                  {item.readMins ? ` · ${item.readMins} min read` : ""}
                </span>
              </span>
            </Link>
          </div>
        )}
        {item.meta?.youtubeId ? (
          <VideoPlayer id={item.meta.youtubeId} title={item.title}>
            <Cover item={item} className="detail-cover" large />
          </VideoPlayer>
        ) : (
          <Cover item={item} className="detail-cover" large />
        )}
        <div className="detail-layout">
          <Facts item={item} />
          <div className="prose" id="article-body">
            <Body lines={item.body ?? []} adAfter={item.type === "article" || item.type === "news" ? 2 : 0} />
            {item.sources && item.sources.length > 0 && (
              <section className="sources" aria-labelledby="sources-title">
                <h2 id="sources-title">Sources</h2>
                <p>
                  {item.type === "news" ? "This story is our summary of reporting by " : "Further reading from "}
                  {item.sources.map((src, i) => (
                    <span key={src.url}>
                      {i > 0 && (i === item.sources!.length - 1 ? " and " : ", ")}
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.name}
                      </a>
                    </span>
                  ))}
                  . Read the original for full detail.
                </p>
              </section>
            )}
            {item.meta?.url && item.type === "video" && (
              <p>
                <a className="btn" href={item.meta.url} target="_blank" rel="noopener noreferrer">
                  {item.meta.linkLabel}
                </a>
              </p>
            )}
          </div>
        </div>
        <Subscribe variant="inline" />
        {related.length > 0 && (
          <section className="related" aria-labelledby="related-title">
            <div className="section-head">
              <h2 id="related-title" className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                More in {disciplineByKey(item.disciplines[0]).name}
              </h2>
              <Link href={`/discipline/${item.disciplines[0]}/`} className="link-more">
                See all
              </Link>
            </div>
            <div className="grid" style={{ paddingTop: 0 }}>
              {related.map((r) => (
                <ContentCard key={r.slug} item={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
