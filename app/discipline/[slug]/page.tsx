import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingGrid from "@/components/ListingGrid";
import Reveal from "@/components/Reveal";
import { DISCIPLINES, itemsOfDiscipline, type DisciplineKey } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ slug: d.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DISCIPLINES.find((x) => x.key === slug);
  return d ? { title: `${d.name} design`, description: `${d.blurb} Articles, tips, software, AI models and videos for ${d.name} designers.` } : {};
}

export default async function DisciplinePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DISCIPLINES.find((x) => x.key === slug);
  if (!d) notFound();
  const items = itemsOfDiscipline(d.key as DisciplineKey);

  return (
    <>
      <header className="page-head" style={{ ["--c" as string]: d.color }}>
        <span className="aura" aria-hidden="true" />
        <div className="wrap">
          <Reveal>
            <h1 className="page-title" data-reveal>
              {d.name}
            </h1>
          </Reveal>
          <p className="page-intro">{d.blurb}</p>
        </div>
      </header>
      <div className="wrap">
        <ListingGrid items={items} showFilters={false} />
      </div>
    </>
  );
}
