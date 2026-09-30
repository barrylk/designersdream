"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Pins the section and turns vertical scroll into a horizontal slide through the latest drops. */
export default function DropsRail({ head, children }: { head: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>(".rail-track")!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: root.current!.querySelector(".rail-pin"),
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Cards tilt slightly while moving, then settle.
        gsap.utils.toArray<HTMLElement>(".rail-track .card").forEach((card, i) => {
          gsap.from(card, {
            y: 40 + (i % 3) * 30,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="rail-section" ref={root} aria-labelledby="latest-title">
      <div className="rail-pin">
        <div className="wrap">{head}</div>
        <div className="rail-track">{children}</div>
      </div>
    </section>
  );
}
