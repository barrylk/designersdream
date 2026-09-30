import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingGrid from "@/components/ListingGrid";
import Reveal from "@/components/Reveal";
import { TYPES, itemsOfType, typeByRoute } from "@/lib/content";

export const dynamicParams = false;

const AURA: Record<string, string> = {
  articles: "#FF3FA4",
  tips: "#FFD43B",
  software: "#39D5F0",
  "ai-models": "#8C7BFF",
  videos: "#FF8A3D",
};

export function generateStaticParams() {
  return TYPES.map((t) => ({ type: t.route }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const t = typeByRoute(type);
  return t ? { title: t.name, description: t.intro, alternates: { canonical: `/${t.route}/` } } : {};
}

export default async function ListingPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const t = typeByRoute(type);
  if (!t) notFound();
  const items = itemsOfType(t.key);

  return (
    <>
      <header className="page-head" style={{ ["--c" as string]: AURA[t.route] }}>
        <span className="aura" aria-hidden="true" />
        <div className="wrap">
          <Reveal>
            <h1 className="page-title" data-reveal>
              {t.name}
            </h1>
          </Reveal>
          <p className="page-intro">{t.intro}</p>
        </div>
      </header>
      <div className="wrap">
        <ListingGrid items={items} />
      </div>
    </>
  );
}
