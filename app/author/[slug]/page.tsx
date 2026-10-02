import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingGrid from "@/components/ListingGrid";
import { AUTHORS } from "@/lib/authors";
import { ITEMS, byDate } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = AUTHORS[slug as keyof typeof AUTHORS];
  return a ? { title: a.name, description: a.bio[0], alternates: { canonical: `/author/${slug}/` } } : {};
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = AUTHORS[slug as keyof typeof AUTHORS];
  if (!a) notFound();
  const items = ITEMS.filter((i) => i.author === a.key).sort(byDate);

  return (
    <>
      <header className="page-head" style={{ ["--c" as string]: "#FF3FA4" }}>
        <span className="aura" aria-hidden="true" />
        <div className="wrap author-head">
          <span className="author-avatar author-avatar-lg" aria-hidden="true">
            {a.initial}
          </span>
          <div>
            <h1 className="page-title">{a.name}</h1>
            <p className="author-role">{a.role}</p>
            {a.bio.map((p) => (
              <p className="page-intro" key={p}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </header>
      <div className="wrap">
        <ListingGrid items={items} />
      </div>
    </>
  );
}
