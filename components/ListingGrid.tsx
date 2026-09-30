"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DISCIPLINES, type DisciplineKey, type Item } from "@/lib/content";
import ContentCard from "./ContentCard";

gsap.registerPlugin(Flip, ScrollTrigger);

/** Grid with discipline filters. Cards glide to their new places when the filter changes. */
export default function ListingGrid({ items, showFilters = true }: { items: Item[]; showFilters?: boolean }) {
  const [filter, setFilter] = useState<DisciplineKey | "all">("all");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const present = DISCIPLINES.filter((d) => items.some((i) => i.disciplines.includes(d.key)));
  const shown = filter === "all" ? items : items.filter((i) => i.disciplines.includes(filter));

  const choose = (f: DisciplineKey | "all") => {
    if (grid.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipState.current = Flip.getState(grid.current.querySelectorAll(".card"));
    }
    setFilter(f);
  };

  useLayoutEffect(() => {
    if (!flipState.current || !grid.current) return;
    Flip.from(flipState.current, {
      targets: grid.current.querySelectorAll(".card"),
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [filter]);

  return (
    <>
      {showFilters && present.length > 1 && (
        <div className="filters" role="group" aria-label="Filter by discipline">
          <button type="button" className="filter" aria-pressed={filter === "all"} onClick={() => choose("all")}>
            All
          </button>
          {present.map((d) => (
            <button key={d.key} type="button" className="filter" aria-pressed={filter === d.key} onClick={() => choose(d.key)}>
              <span className="dot" style={{ ["--c" as string]: d.color }} />
              {d.name}
            </button>
          ))}
        </div>
      )}
      <div className="grid" ref={grid}>
        {shown.map((item) => (
          <ContentCard key={item.slug} item={item} />
        ))}
        {shown.length === 0 && <p className="empty">Nothing here yet for this discipline. Try All.</p>}
      </div>
    </>
  );
}
