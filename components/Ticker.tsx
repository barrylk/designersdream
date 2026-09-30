"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type TickerEntry = { label: string; kind: string; color: string };

/** Endless strip of new tools and models. Scrolling faster pushes it faster. */
export default function Ticker({ entries }: { entries: TickerEntry[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const track = root.current!.querySelector(".ticker-track")!;
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 250, 5);
          const dir = self.direction === -1 ? -1 : 1;
          gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" });
        },
      });
    },
    { scope: root },
  );

  const row = entries.map((e, i) => (
    <span className="ticker-item" key={i}>
      <i style={{ background: e.color }} />
      {e.label}
      <small>{e.kind}</small>
    </span>
  ));

  return (
    <div className="ticker" ref={root} aria-label="Recently added tools and models">
      <div className="ticker-track">
        {row}
        <span aria-hidden="true" style={{ display: "contents" }}>
          {row}
        </span>
      </div>
    </div>
  );
}
