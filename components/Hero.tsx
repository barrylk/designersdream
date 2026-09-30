"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InkField from "./InkField";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const title = root.current!.querySelector(".hero-title")!;
      const foot = root.current!.querySelector(".hero-foot")!;
      if (reduce) {
        gsap.set([title, foot], { autoAlpha: 1 });
        return;
      }

      // The one orchestrated moment: letters rise out of the ink, then the lede settles.
      const split = SplitText.create(title.querySelectorAll(".line-text"), { type: "chars", charsClass: "char" });
      gsap.set(title, { autoAlpha: 1 });
      gsap
        .timeline({ delay: 0.15 })
        .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.2, ease: "expo.out", stagger: 0.035 })
        .fromTo(foot, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.7");

      // As you scroll away, the headline drifts up faster than the page.
      gsap.to(title, {
        yPercent: -28,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="hero" ref={root} aria-labelledby="hero-title">
      <InkField className="hero-canvas" />
      <div className="wrap hero-inner">
        <h1 id="hero-title" className="hero-title hero-anim">
          <span className="line">
            <span className="line-text">Designers</span>
          </span>
          <span className="line line-2">
            <span className="line-text">Dream</span>
          </span>
        </h1>
        <div className="hero-foot hero-anim">
          <p className="hero-lede">
            Articles, quick tips, new software, AI models and videos for every kind of designer, updated every week.
          </p>
          <div className="hero-actions">
            <Link href="/articles/" className="btn btn-solid" data-magnetic>
              Start reading
            </Link>
            <Link href="/ai-models/" className="btn" data-magnetic>
              Browse AI models
            </Link>
          </div>
        </div>
      </div>
      <span className="hero-hint" aria-hidden="true">
        Move your cursor through the ink
      </span>
    </section>
  );
}
