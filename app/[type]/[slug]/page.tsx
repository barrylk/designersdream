import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/Cover";
import ContentCard from "@/components/ContentCard";
import ReadingProgress from "@/components/ReadingProgress";
import Reveal from "@/components/Reveal";
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
import { SITE_URL } from "@/lib/site";

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
function Body({ lines }: { lines: string[] }) {
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
    else out.push(<p key={out.length}>{line}</p>);
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

  const jsonLd =
    item.type === "article"
      ? { "@context": "https://schema.org", "@type": "Article", headline: item.title, description: item.excerpt, datePublished: item.date, url: `${SITE_URL}/${type}/${slug}/` }
      : item.type === "software"
        ? { "@context": "https://schema.org", "@type": "SoftwareApplication", name: item.title, description: item.excerpt, applicationCategory: "DesignApplication", url: item.meta?.url }
        : { "@context": "https://schema.org", "@type": "WebPage", name: item.title, description: item.excerpt };

  return (
    <article>
      {item.type === "article" && <ReadingProgress />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap detail-hero">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={`/${t.route}/`}>{t.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{item.title}</span>
        </nav>
        <Reveal>
          <h1 className="detail-title" data-reveal>
            {item.title}
          </h1>
        </Reveal>
        <p className="detail-lede">{item.excerpt}</p>
        <Cover item={item} className="detail-cover" large />
        <div className="detail-layout">
          <Facts item={item} />
          <div className="prose" id="article-body">
            <Body lines={item.body ?? []} />
            {item.meta?.url && item.type === "video" && (
              <p>
                <a className="btn" href={item.meta.url} target="_blank" rel="noopener noreferrer">
                  {item.meta.linkLabel}
                </a>
              </p>
            )}
          </div>
        </div>
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
